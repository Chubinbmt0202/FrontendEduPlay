// src/pages/StudentWorkspace.jsx

import React from 'react';
import { Layout, Typography, Tabs, Space, Alert, Button, Modal } from 'antd'; // 👈 Thêm Button
import { useNavigate } from 'react-router-dom'; // 👈 Thêm useNavigate
import {
    UnorderedListOutlined,
    CheckSquareOutlined,
    EditOutlined,
    SwapOutlined,
    IdcardOutlined,
    AppstoreAddOutlined,
    ArrowLeftOutlined, // 👈 Thêm icon mũi tên
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
    const { lessonData } = useLessonData();
    const [open, setOpen] = React.useState(false);
    console.log("Lesson Data trong StudentWorkspace:", lessonData);

    const showModal = () => {
        setOpen(true);
    }

    const hideModal = () => {
        setOpen(false);
    }
    // 1. Khởi tạo navigate hook
    const navigate = useNavigate();

    // 2. Hàm xử lý sự kiện quay lại
    const handleBack = () => {
        // Sử dụng navigate(-1) để quay lại trang trước đó trong lịch sử trình duyệt
        navigate(-1);
    };

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
        <Layout className="student-workspace-layout">
            <Content style={{ padding: '0 24px' }}>
                {/* 3. Container chứa Title và Back button */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px',
                        padding: '16px 0',
                    }}
                >
                    <Button
                        type="default"
                        icon={<ArrowLeftOutlined />}
                        onClick={showModal}
                        size="large"
                    >
                        Quay lại trang tạo bài
                    </Button>
                    <Title level={2} style={{ margin: 0 }}>
                        {lessonData.lesson_title}
                    </Title>

                    <Modal
                        title="Bạn có chắc chắn muốn quay lại trang tạo bài không?"
                        open={open}
                        onOk={handleBack}
                        onCancel={hideModal}
                        okText="OK"
                        cancelText="Hủy"
                    >
                        <p>Quay lại trang tạo bài sẽ mất bộ đề bạn vừa tạo</p>
                    </Modal>

                </div>

                <Tabs
                    defaultActiveKey="0"
                    tabPosition="left"
                    items={tabItems}
                    style={{
                        background: '#fff', // Dùng màu trắng cho nội dung chính
                        borderRadius: '8px',
                        // Bỏ padding ở đây vì đã có container bọc ngoài Content
                    }}
                    tabBarStyle={{
                        padding: '12px',
                        borderRight: '1px solid #f0f0f0', // Dùng border nhẹ hơn
                        // boxShadow: '0 2px 8px rgba(0,0,0,0.05)', // Có thể giữ lại hoặc bỏ
                    }}
                />
            </Content>
        </Layout >
    );
}

export default StudentWorkspace;