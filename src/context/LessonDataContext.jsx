/* eslint-disable react-refresh/only-export-components */
// src/context/LessonDataContext.jsx
import React, { createContext, useState, useContext } from 'react';
import { jsonData } from '../data'; // Dữ liệu mặc định

const LessonDataContext = createContext();

export function LessonDataProvider({ children }) {
    const [lessonData, setLessonData] = useState(jsonData);

    // Cập nhật toàn bộ dữ liệu bài học (nếu cần)
    const updateLessonData = (newData) => {
        if (newData && newData.generated_games) {
            setLessonData(newData);
            return true;
        }
        console.error('Dữ liệu cập nhật không hợp lệ:', newData);
        return false;
    };

    // Helper: xác định key mảng chứa items cho mỗi game_type
    const getGameKey = (gameType) => {
        switch (gameType) {
            case 'multiple_choice_abcd':
                return 'questions';
            case 'true_false':
                return 'statements';
            case 'fill_in_the_blank':
                return 'sentences';
            case 'matching':
                return 'pairs';
            case 'flashcards':
                return 'cards';
            case 'sorting':
                return 'categories';
            default:
                return null;
        }
    };

    // ====== THÊM / SỬA / XÓA (immutable updates) ======

    const addItem = (gameIndex, newItem) => {
        setLessonData((prev) => {
            if (!prev || !Array.isArray(prev.generated_games)) return prev;

            const updatedGeneratedGames = prev.generated_games.map((g, idx) => {
                if (idx !== gameIndex) return g;
                const key = getGameKey(g.game_type);
                if (!key) return g;
                const prevArr = Array.isArray(g[key]) ? g[key] : [];
                // tạo bản sao mảng và thêm phần tử mới
                const newArr = [...prevArr, newItem];
                return { ...g, [key]: newArr };
            });

            return { ...prev, generated_games: updatedGeneratedGames };
        });
    };

    const updateItem = (gameIndex, itemIndex, newItem) => {
        setLessonData((prev) => {
            if (!prev || !Array.isArray(prev.generated_games)) return prev;

            const updatedGeneratedGames = prev.generated_games.map((g, idx) => {
                if (idx !== gameIndex) return g;
                const key = getGameKey(g.game_type);
                if (!key) return g;
                const prevArr = Array.isArray(g[key]) ? g[key] : [];
                // nếu itemIndex ngoài phạm vi thì trả về game không đổi
                if (itemIndex < 0 || itemIndex >= prevArr.length) return g;
                const newArr = prevArr.map((it, i) => (i === itemIndex ? newItem : it));
                return { ...g, [key]: newArr };
            });

            return { ...prev, generated_games: updatedGeneratedGames };
        });
    };

    const deleteItem = (gameIndex, itemIndex) => {
        setLessonData((prev) => {
            if (!prev || !Array.isArray(prev.generated_games)) return prev;

            const updatedGeneratedGames = prev.generated_games.map((g, idx) => {
                if (idx !== gameIndex) return g;
                const key = getGameKey(g.game_type);
                if (!key) return g;
                const prevArr = Array.isArray(g[key]) ? g[key] : [];
                if (itemIndex < 0 || itemIndex >= prevArr.length) return g;
                const newArr = prevArr.filter((_, i) => i !== itemIndex);
                return { ...g, [key]: newArr };
            });

            return { ...prev, generated_games: updatedGeneratedGames };
        });
    };

    return (
        <LessonDataContext.Provider
            value={{
                lessonData,
                updateLessonData,
                addItem,
                updateItem,
                deleteItem,
            }}
        >
            {children}
        </LessonDataContext.Provider>
    );
}

export function useLessonData() {
    const context = useContext(LessonDataContext);
    if (!context) throw new Error('useLessonData must be used within a LessonDataProvider');
    return context;
}
