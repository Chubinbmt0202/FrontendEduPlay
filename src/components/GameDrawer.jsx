// src/components/GameDrawer.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    List,
    Radio,
    Space,
    Tag,
    Typography,
    Card,
    Row,
    Col,
    Alert,
    Drawer,
    Tabs,
    Button,    // Thêm
    Modal,     // Thêm
    Popconfirm,
    message, // Thêm
} from 'antd';
import {
    UnorderedListOutlined,
    CheckSquareOutlined,
    EditOutlined,
    SwapOutlined,
    IdcardOutlined,
    AppstoreAddOutlined,
    ArrowRightOutlined,
    CheckOutlined,
    DeleteOutlined, // Thêm
    PlusOutlined,   // Thêm
} from '@ant-design/icons';

// Import component form (file này bạn đã tạo ở bước trước)
import GameEditForm from './GameEditForm';

const { Title, Text, Paragraph } = Typography;

// --- CÁC HÀM HELPER (getGameTypeName, getGameTypeIcon) GIỮ NGUYÊN ---
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

// --- HÀM RENDER NỘI DUNG (CẬP NHẬT ĐỂ CÓ NÚT SỬA/XÓA) ---
const renderGameContent = (game, gameIndex, onEdit, onDelete) => {

    // Hàm helper render các nút Sửa/Xóa cho mỗi List.Item
    const renderActions = (itemData, itemIndex) => [
        <Button
            type="link"
            key="edit"
            icon={<EditOutlined />}
            onClick={() => onEdit(gameIndex, itemIndex, itemData)}
        >
            Sửa
        </Button>,
        <Popconfirm
            key="delete"
            title="Bạn chắc chắn muốn xóa?"
            onConfirm={() => onDelete(gameIndex, itemIndex)}
            okText="Xóa"
            cancelText="Hủy"
        >
            <Button type="link" danger icon={<DeleteOutlined />}>
                Xóa
            </Button>
        </Popconfirm>,
    ];

    switch (game.game_type) {
        // === TRẮC NGHIỆM ===
        case 'multiple_choice_abcd':
            return (
                <List
                    itemLayout="vertical"
                    dataSource={game.questions}
                    renderItem={(q, index) => (
                        <List.Item actions={renderActions(q, index)}>
                            <List.Item.Meta title={`${index + 1}. ${q.question_text}`} />
                            <Radio.Group value={q.correct_answer_index} disabled>
                                <Space direction="vertical">
                                    {q.options.map((opt, i) => (
                                        <Radio key={i} value={i}>
                                            {opt}
                                            {i === q.correct_answer_index && (
                                                <CheckOutlined style={{ color: 'green', marginLeft: 8 }} />
                                            )}
                                        </Radio>
                                    ))}
                                </Space>
                            </Radio.Group>
                        </List.Item>
                    )}
                />
            );

        // === ĐÚNG / SAI ===
        case 'true_false':
            return (
                <List
                    dataSource={game.statements}
                    renderItem={(s, index) => (
                        <List.Item actions={renderActions(s, index)}>
                            <Space>
                                <Text>{`${index + 1}. ${s.statement_text}`}</Text>
                                {s.is_true ? (
                                    <Tag color="green">ĐÚNG</Tag>
                                ) : (
                                    <Tag color="red">SAI</Tag>
                                )}
                            </Space>
                        </List.Item>
                    )}
                />
            );

        // === ĐIỀN TỪ ===
        case 'fill_in_the_blank':
            return (
                <List
                    dataSource={game.sentences}
                    renderItem={(s, index) => (
                        <List.Item actions={renderActions(s, index)}>
                            <Alert
                                message={s.sentence_with_blank.replace('___', '...')}
                                description={<Text strong>Đáp án: {s.answer}</Text>}
                                type="info"
                            />
                        </List.Item>
                    )}
                />
            );

        // === NỐI ===
        case 'matching':
            return (
                <>
                    <Paragraph italic>{game.instruction}</Paragraph>
                    <List
                        dataSource={game.pairs}
                        renderItem={(p, index) => (
                            <List.Item actions={renderActions(p, index)}>
                                <Space size="large">
                                    <Card size="small" style={{ minWidth: 100, textAlign: 'center' }}>
                                        <Text strong>{p.item_a}</Text>
                                    </Card>
                                    <ArrowRightOutlined style={{ color: '#1677ff' }} />
                                    <Card size="small" style={{ minWidth: 100, textAlign: 'center' }}>
                                        <Text strong>{p.item_b}</Text>
                                    </Card>
                                </Space>
                            </List.Item>
                        )}
                    />
                </>
            );

        // === FLASHCARDS ===
        case 'flashcards':
            return (
                <>
                    <Title level={5}>{game.deck_title}</Title>
                    {/* Thay Row/Col bằng List để thêm action dễ dàng */}
                    <List
                        grid={{ gutter: 16, xs: 1, sm: 2, md: 3 }}
                        dataSource={game.cards}
                        renderItem={(card, index) => (
                            <List.Item>
                                <Card title={card.front} actions={renderActions(card, index)}>
                                    {card.back}
                                </Card>
                            </List.Item>
                        )}
                    />
                </>
            );

        // === PHÂN LOẠI ===
        case 'sorting':
            return (
                <>
                    <Paragraph italic>{game.instruction}</Paragraph>
                    <List
                        bordered
                        dataSource={game.categories}
                        renderItem={(cat, index) => (
                            // Thêm action để sửa/xóa cả 1 category
                            <List.Item actions={renderActions(cat, index)}>
                                <List.Item.Meta title={cat.category_name} />
                                <Space wrap>
                                    {cat.items.map((item, i) => (
                                        <Tag color="blue" key={i}>
                                            {item}
                                        </Tag>
                                    ))}
                                </Space>
                            </List.Item>
                        )}
                    />
                </>
            );
        default:
            return <pre>{JSON.stringify(game, null, 2)}</pre>;
    }
};

// --- COMPONENT CHÍNH (ĐÃ CẬP NHẬT) ---
function GameDrawer({
    open,
    onClose,
    data,
    onAddItem,
    onUpdateItem,
    onDeleteItem
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const navigate = useNavigate();

    if (!data) return null;

    // Mở modal để SỬA
    const handleOpenEditModal = (gameIndex, itemIndex, itemData) => {
        setEditingItem({
            gameIndex,
            itemIndex,
            data: itemData,
            gameType: data.generated_games[gameIndex].game_type,
        });
        setIsModalOpen(true);
    };

    // Mở modal để THÊM MỚI
    const handleOpenAddModal = (gameIndex) => {
        setEditingItem({
            gameIndex,
            itemIndex: null, // itemIndex = null báo hiệu đây là THÊM MỚI
            data: null, // data = null để form tạo giá trị mặc định
            gameType: data.generated_games[gameIndex].game_type,
        });
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    // Xử lý khi bấm LƯU trên modal
    const handleModalSave = (values) => {
        if (editingItem.itemIndex === null) {
            // THÊM MỚI
            onAddItem(editingItem.gameIndex, values);
        } else {
            // CẬP NHẬT
            onUpdateItem(editingItem.gameIndex, editingItem.itemIndex, values);
        }
        handleModalClose();
    };


    // Chuyển đổi mảng 'generated_games' thành 'items' cho Tabs
    const tabItems = data.generated_games.map((game, index) => {
        return {
            key: index.toString(),
            label: (
                <Space>
                    {getGameTypeIcon(game.game_type)}
                    {getGameTypeName(game.game_type)}
                </Space>
            ),
            children: (
                <div style={{ padding: '0 16px' }}>
                    {/* Truyền hàm onEdit, onDelete xuống */}
                    {renderGameContent(game, index, handleOpenEditModal, onDeleteItem)}

                    {/* Nút Thêm Mới cho mỗi tab */}
                    <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        style={{ marginTop: 16, width: '100%' }}
                        onClick={() => handleOpenAddModal(index)}
                    >
                        Thêm bài tập
                    </Button>
                </div>
            ),
        };
    });

    const handleChangePage = () => {
        message.success('Chuyển đến trang học sinh để xuất bộ đề');
        navigate('/student');

    }

    return (
        // Dùng Fragment ( <>...</> ) để bọc Drawer và Modal
        <>
            <Drawer
                title={<Text style={{ fontSize: 18, fontWeight: 600 }}>{data.lesson_title}</Text>}
                placement="right"
                width={'70%'}
                onClose={onClose}
                open={open}
                bodyStyle={{ padding: 0 }}
                extra={
                    <Space>
                        <Button danger>Thay thế bộ đề khác</Button>
                        <Button type="primary" onClick={handleChangePage}>
                            Xuất bộ đề
                        </Button>
                    </Space>
                }
            >
                <Tabs
                    defaultActiveKey="0"
                    tabPosition="left"
                    items={tabItems}
                    style={{ height: '100%' }}
                />
            </Drawer>

            {/* Modal để Thêm/Sửa */}
            <Modal
                title={editingItem?.itemIndex === null ? 'Thêm bài tập mới' : 'Chỉnh sửa bài tập'}
                open={isModalOpen}
                onCancel={handleModalClose}
                footer={null} // Footer sẽ do component Form tự quản lý
                destroyOnClose // Reset form khi đóng
                width={800} // Tăng kích thước modal cho dễ nhập
            >
                {/* Render form động khi modal mở */}
                {editingItem && (
                    <GameEditForm
                        gameType={editingItem.gameType}
                        initialData={editingItem.data}
                        onSave={handleModalSave}
                        onCancel={handleModalClose}
                    />
                )}
            </Modal>
        </>
    );
}

export default GameDrawer;