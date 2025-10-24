/* eslint-disable react-refresh/only-export-components */
// src/context/LessonDataContext.jsx
import React, { createContext, useState, useContext } from 'react';
import { jsonData } from '../data';

const LessonDataContext = createContext();

export function LessonDataProvider({ children }) {
    const [lessonData, setLessonData] = useState(jsonData);

    const getGameKey = (gameType) => {
        switch (gameType) {
            case 'multiple_choice_abcd': return 'questions';
            case 'true_false': return 'statements';
            case 'fill_in_the_blank': return 'sentences';
            case 'matching': return 'pairs';
            case 'flashcards': return 'cards';
            case 'sorting': return 'categories';
            default: return null;
        }
    };

    // Add (immutable)
    const addItem = (gameIndex, newItem) => {
        setLessonData((prev) => {
            if (!prev || !Array.isArray(prev.generated_games)) return prev;
            const generated_games = prev.generated_games.map((g, idx) => {
                if (idx !== gameIndex) return g;
                const key = getGameKey(g.game_type);
                const prevArr = Array.isArray(g[key]) ? g[key] : [];
                return { ...g, [key]: [...prevArr, newItem] };
            });
            return { ...prev, generated_games };
        });
    };

    // Update (immutable)
    const updateItem = (gameIndex, itemIndex, newItem) => {
        setLessonData((prev) => {
            if (!prev || !Array.isArray(prev.generated_games)) return prev;
            const generated_games = prev.generated_games.map((g, idx) => {
                if (idx !== gameIndex) return g;
                const key = getGameKey(g.game_type);
                const prevArr = Array.isArray(g[key]) ? g[key] : [];
                if (itemIndex < 0 || itemIndex >= prevArr.length) return g;
                const newArr = prevArr.map((it, i) => (i === itemIndex ? newItem : it));
                return { ...g, [key]: newArr };
            });
            return { ...prev, generated_games };
        });
    };

    // Delete (immutable)
    const deleteItem = (gameIndex, itemIndex) => {
        setLessonData((prev) => {
            if (!prev || !Array.isArray(prev.generated_games)) return prev;
            const generated_games = prev.generated_games.map((g, idx) => {
                if (idx !== gameIndex) return g;
                const key = getGameKey(g.game_type);
                const prevArr = Array.isArray(g[key]) ? g[key] : [];
                if (itemIndex < 0 || itemIndex >= prevArr.length) return g;
                const newArr = prevArr.filter((_, i) => i !== itemIndex);
                return { ...g, [key]: newArr };
            });
            return { ...prev, generated_games };
        });
    };

    const updateLessonData = (newData) => {
        if (newData && newData.generated_games) {
            setLessonData(newData);
            return true;
        }
        console.error('Dữ liệu cập nhật không hợp lệ:', newData);
        return false;
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
