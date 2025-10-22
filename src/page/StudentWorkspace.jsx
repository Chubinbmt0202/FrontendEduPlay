// src/pages/StudentWorkspace.jsx

import React from 'react';
import { Layout, Typography, Tabs, Space, Alert } from 'antd';
import {
    UnorderedListOutlined,
    CheckSquareOutlined,
    EditOutlined,
    SwapOutlined,
    IdcardOutlined,
    AppstoreAddOutlined,
} from '@ant-design/icons';
import { useLessonData } from '../context/LessonDataContext';
// Dùng chung data
// import { jsonData } from '../data';

// Import các component game tương tác
import MultipleChoiceGame from '../components/studentPage/MultipleChoiceGame/MultipleChoiceGame';
import TrueFalseGame from '../components/studentPage/TrueFalse/TrueFalseGame';
import FillInTheBlankGame from '../components/studentPage/FillBlank/FillBlank';
import MatchingGame from '../components/studentPage/Matching/MatchingGame';
import FlashCardsGame from '../components/studentPage/FlashCard/FlashCardsGame';
import SortingGame from '../components/studentPage/Sorting/SortingGame';
import './StudentWorkspace.css';
// (Bạn sẽ import các component game khác ở đây)

const { Header, Content } = Layout;
const { Title, Text } = Typography;

// --- CÁC HÀM HELPER (Lấy từ GameDrawer) ---
const getGameTypeName = (type) => {
    switch (type) {
        case 'multiple_choice_abcd':
            return 'Bài tập Trắc nghiệm';
        case 'true_false':
            return 'Bài tập Đúng / Sai';
        case 'fill_in_the_blank':
            return 'Bài tập Điền từ';
        case 'matching':
            return 'Bài tập Nối';
        case 'flashcards':
            return 'Bài tập Thẻ ghi nhớ';
        case 'sorting':
            return 'Bài tập Phân loại';
        default:
            return type;
    }
};

const getGameTypeIcon = (type) => {
    switch (type) {
        case 'multiple_choice_abcd':
            return <UnorderedListOutlined />;
        case 'true_false':
            return <CheckSquareOutlined />;
        case 'fill_in_the_blank':
            return <EditOutlined />;
        case 'matching':
            return <SwapOutlined />;
        case 'flashcards':
            return <IdcardOutlined />;
        case 'sorting':
            return <AppstoreAddOutlined />;
        default:
            return null;
    }
};

// --- Hàm render game TƯƠNG TÁC ---
const renderInteractiveGame = (game) => {
    switch (game.game_type) {
        case 'multiple_choice_abcd':
            return <MultipleChoiceGame gameData={game} />;
        case 'true_false':
            return <TrueFalseGame gameData={game} />;
        case 'fill_in_the_blank':
            return <FillInTheBlankGame gameData={game} />;
        case 'matching':
            return <MatchingGame gameData={game} />;
        case 'flashcards':
            return <FlashCardsGame gameData={game} />;
        case 'sorting':
            return <SortingGame gameData={game} />;

        // (Thêm các case cho game khác ở đây)

        default:
            return (
                <Alert
                    message={`Bài tập dạng "${getGameTypeName(game.game_type)}" đang được phát triển.`}
                    type="info"
                    showIcon
                />
            );
    }
};


function StudentWorkspace() {
    // Quyết định dùng data nào (ở đây ta dùng data tĩnh)
    // const lessonDataToShow = jsonData;
    const { lessonData } = useLessonData();
    console.log("Lesson Data trong StudentWorkspace:", lessonData);

    // Tạo tab items từ dữ liệu
    const tabItems = lessonData.generated_games.map((game, index) => ({
        key: index.toString(),
        label: (
            <Space>
                {getGameTypeIcon(game.game_type)}
                {getGameTypeName(game.game_type)}
            </Space>
        ),
        children: (
            // Thêm padding cho nội dung tab
            <div style={{ padding: '16px' }}>
                {renderInteractiveGame(game)}
            </div>
        ),
    }));

    return (
        <Layout>
            <Content>
                <Title level={2}>{lessonData.lesson_title}</Title>
                <Tabs
                    defaultActiveKey="0"
                    tabPosition="left"
                    items={tabItems}
                    style={{
                        background: '#f5f7fa',
                        borderRadius: '8px',
                        padding: '24px',
                    }}
                    tabBarStyle={{
                        padding: '12px',
                        borderRight: '1px solid #130808ff',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    }}
                />
            </Content>
        </Layout >
    );
}

export default StudentWorkspace;