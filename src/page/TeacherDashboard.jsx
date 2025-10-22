// src/pages/TeacherDashboard.jsx

import React from 'react';
import { Button, Layout } from 'antd';
import '../App.css'; // Cập nhật đường dẫn
import GameDrawer from '../components/GameDrawer'; // Cập nhật đường dẫn
import UploadFeature from '../components/UploadFeature'; // Cập nhật đường dẫn
import { jsonData } from "../data"; // Cập nhật đường dẫn
import { useLessonData } from '../context/LessonDataContext';

// Hàm helper cho GameDrawer
const getItemArrayKey = (game) => {
    if (game.questions) return 'questions';
    if (game.statements) return 'statements';
    if (game.sentences) return 'sentences';
    if (game.pairs) return 'pairs';
    if (game.cards) return 'cards';
    if (game.categories) return 'categories';
    return null;
};

const { Content } = Layout;

// Đổi tên function App -> TeacherDashboard
function TeacherDashboard() {
    const { lessonData, updateLessonData } = useLessonData();
    // const [lessonData, setLessonData] = React.useState(jsonData);

    // State để chỉ quản lý GameDrawer
    const [isGameDrawerOpen, setIsGameDrawerOpen] = React.useState(false);

    // Các hàm điều khiển GameDrawer
    const showGameDrawer = () => {
        console.log("Opening Game Drawer");
        console.log("Lesson Data trong showGameDrawer:", lessonData);
        setIsGameDrawerOpen(true);
    }

    const onCloseGameDrawer = () => {
        setIsGameDrawerOpen(false);
    };

    // --- Logic CRUD cho GameDrawer (giữ nguyên) ---
    const handleAddItem = (gameIndex, newItemData) => {
        updateLessonData((prevData) => {
            const newData = JSON.parse(JSON.stringify(prevData));
            const game = newData.generated_games[gameIndex];
            const key = getItemArrayKey(game);
            if (key) {
                game[key].push(newItemData);
            }
            return newData;
        });
    };

    const handleUpdateItem = (gameIndex, itemIndex, updatedItemData) => {
        updateLessonData((prevData) => {
            const newData = JSON.parse(JSON.stringify(prevData));
            const game = newData.generated_games[gameIndex];
            const key = getItemArrayKey(game);
            if (key && game[key][itemIndex]) {
                game[key][itemIndex] = updatedItemData;
            }
            return newData;
        });
    };

    const handleDeleteItem = (gameIndex, itemIndex) => {
        updateLessonData((prevData) => {
            const newData = JSON.parse(JSON.stringify(prevData));
            const game = newData.generated_games[gameIndex];
            const key = getItemArrayKey(game);
            if (key && game[key][itemIndex]) {
                game[key].splice(itemIndex, 1);
            }
            return newData;
        });
    };
    // --- Hết logic CRUD ---

    return (
        <div>
            <UploadFeature />


            <Content style={{ paddingTop: 24 }}>
                <h1 level={4}>Thông tin bài học</h1>
                <h1 level={2}>{jsonData.course_title}</h1>
                <Button
                    type="primary"
                    onClick={showGameDrawer}
                >
                    Xem các bài tập
                </Button>
            </Content>


            <GameDrawer
                open={isGameDrawerOpen}
                onClose={onCloseGameDrawer}
                data={lessonData}
                onAddItem={handleAddItem}
                onUpdateItem={handleUpdateItem}
                onDeleteItem={handleDeleteItem}
            />


        </div>
    );
}

export default TeacherDashboard;