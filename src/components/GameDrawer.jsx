/* eslint-disable no-case-declarations */
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
    Drawer,
    Tabs,
    Button,
    Modal,
    Popconfirm,
    message,
    Alert,
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
    DeleteOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import GameEditForm from './GameEditForm';
import { useLessonData } from '../context/LessonDataContext';

const { Text, Paragraph, Title } = Typography;

const getGameTypeName = (type) => {
    switch (type) {
        case 'multiple_choice_abcd': return 'Bài tập Trắc nghiệm';
        case 'true_false': return 'Bài tập Đúng / Sai';
        case 'fill_in_the_blank': return 'Bài tập Điền từ';
        case 'matching': return 'Bài tập Nối';
        case 'flashcards': return 'Bài tập Thẻ ghi nhớ';
        case 'sorting': return 'Bài tập Phân loại';
        default: return type;
    }
};

const getGameTypeIcon = (type) => {
    switch (type) {
        case 'multiple_choice_abcd': return <UnorderedListOutlined />;
        case 'true_false': return <CheckSquareOutlined />;
        case 'fill_in_the_blank': return <UnorderedListOutlined />;
        case 'matching': return <SwapOutlined />;
        case 'flashcards': return <IdcardOutlined />;
        case 'sorting': return <AppstoreAddOutlined />;
        default: return null;
    }
};

const renderGameContent = (game, gameIndex, onEdit, onDelete) => {
    const renderActions = (itemData, itemIndex) => [
        <Button type="link" key="edit" icon={<EditOutlined />} onClick={() => onEdit(gameIndex, itemIndex, itemData)}>
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
        case 'multiple_choice_abcd':
            return (
                <List
                    itemLayout="vertical"
                    dataSource={game.questions || []}
                    renderItem={(q, index) => (
                        <List.Item actions={renderActions(q, index)}>
                            <List.Item.Meta title={`${index + 1}. ${q.question_text}`} />
                            <Radio.Group value={q.correct_answer_index} disabled>
                                <Space direction="vertical">
                                    {Array.isArray(q.options) && q.options.map((opt, i) => (
                                        <Radio key={i} value={i}>
                                            {opt}
                                            {i === q.correct_answer_index && <CheckOutlined style={{ color: 'green', marginLeft: 8 }} />}
                                        </Radio>
                                    ))}
                                </Space>
                            </Radio.Group>
                        </List.Item>
                    )}
                />
            );

        case 'true_false':
            return (
                <List
                    dataSource={game.statements || []}
                    renderItem={(s, index) => (
                        <List.Item actions={renderActions(s, index)}>
                            <Space>
                                <Text>{`${index + 1}. ${s.statement_text}`}</Text>
                                {s.is_true ? <Tag color="green">ĐÚNG</Tag> : <Tag color="red">SAI</Tag>}
                            </Space>
                        </List.Item>
                    )}
                />
            );

        case 'fill_in_the_blank':
            return (
                <List
                    dataSource={game.sentences || []}
                    renderItem={(s, index) => (
                        <List.Item actions={renderActions(s, index)}>
                            <Alert
                                message={s.sentence_with_blank?.replace('___', '...') || s.sentence_with_blank || ''}
                                description={<Text strong>Đáp án: {s.answer}</Text>}
                                type="info"
                            />
                        </List.Item>
                    )}
                />
            );

        case 'matching': {
            // 1. Lấy dữ liệu nguồn, có thể chứa các đối tượng game bị lồng
            const rawData = game.pairs || [];

            // 2. CHUẨN HÓA: Dùng flatMap để duyệt qua mảng và trích xuất các pairs
            const normalizedPairs = rawData.flatMap(item => {
                // Nếu item là một cặp hợp lệ (có item_a và item_b)
                if (item && typeof item === 'object' && item.item_a !== undefined && item.item_b !== undefined) {
                    return [item]; // Trả về cặp đó
                }

                // Nếu item là một đối tượng game bị lồng (có thuộc tính 'pairs')
                if (item && typeof item === 'object' && Array.isArray(item.pairs)) {
                    // Trích xuất các pairs từ đối tượng lồng (và lọc các cặp không hợp lệ trong đó)
                    return item.pairs.filter(p => p && p.item_a !== undefined && p.item_b !== undefined);
                }

                // Loại bỏ các phần tử khác
                return [];
            });

            console.log('Normalized Matching Pairs:', normalizedPairs);

            return (
                <>
                    <Paragraph italic>{game.instruction}</Paragraph>
                    <List
                        // Sử dụng dữ liệu đã được chuẩn hóa
                        dataSource={normalizedPairs}
                        renderItem={(p, index) => (
                            <List.Item actions={renderActions(p, index)} key={index}>
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
        } // Đóng khối case

        case 'flashcards': {
            // 1. Lấy dữ liệu nguồn
            const rawData = game.cards || [];

            // 2. CHUẨN HÓA: Dùng flatMap để duyệt qua mảng và trích xuất/lọc các thẻ hợp lệ
            const normalizedCards = rawData.flatMap(item => {
                // Trường hợp 1: Item là một thẻ hợp lệ (cấu trúc cũ)
                if (item && typeof item === 'object' && item.front !== undefined && item.back !== undefined) {
                    return [item];
                }

                // Trường hợp 2: Item là một đối tượng game bị lồng (cấu trúc mới)
                if (item && typeof item === 'object' && Array.isArray(item.cards)) {
                    // Trích xuất các cards từ đối tượng lồng (và lọc các thẻ không hợp lệ trong đó)
                    return item.cards.filter(c => c && c.front !== undefined && c.back !== undefined);
                }

                // Loại bỏ các phần tử khác
                return [];
            });

            return (
                <>
                    {/* Sử dụng deck_title nếu có */}
                    <Title level={5}>{game.deck_title || "Bộ thẻ ghi nhớ"}</Title>
                    <List
                        grid={{ gutter: 16, xs: 1, sm: 2, md: 3 }}
                        // ✨ SỬ DỤNG DỮ LIỆU ĐÃ CHUẨN HÓA (normalizedCards) ✨
                        dataSource={normalizedCards}
                        renderItem={(card, index) => (
                            <List.Item key={index}>
                                <Card title={card.front} actions={renderActions(card, index)}>
                                    {card.back}
                                </Card>
                            </List.Item>
                        )}
                    />
                </>
            );
        }

        case 'sorting':
            const rawDataSorting = game.categories || [];

            // 2. chuẩn hóa dữ liệu categories
            const normalizedCategories = rawDataSorting.flatMap(item => {
                // Nếu item là một category hợp lệ
                if (item && typeof item === 'object' && item.category_name !== undefined && Array.isArray(item.items)) {
                    return [item];
                }
                // Nếu item là một đối tượng game bị lồng (có thuộc tính 'categories')
                if (item && typeof item === 'object' && Array.isArray(item.categories)) {
                    // Trích xuất các categories từ đối tượng lồng (và lọc các category không hợp lệ trong đó)
                    return item.categories.filter(cat => cat && cat.category_name !== undefined && Array.isArray(cat.items));
                }

                // Loại bỏ các phần tử khác
                return [];
            });
            return (
                <>
                    <Paragraph italic>{game.instruction}</Paragraph>
                    <List
                        bordered
                        dataSource={normalizedCategories || []}
                        renderItem={(cat, index) => (
                            <List.Item actions={renderActions(cat, index)}>
                                <List.Item.Meta title={cat.category_name} />
                                <Space wrap>
                                    {Array.isArray(cat.items) && cat.items.map((item, i) => (
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

function GameDrawer({ open, onClose, data }) {
    const navigate = useNavigate();
    const { addItem, updateItem, deleteItem } = useLessonData();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    if (!data) return null;

    const handleOpenEditModal = (gameIndex, itemIndex, itemData) => {
        setEditingItem({
            gameIndex,
            itemIndex,
            data: itemData,
            gameType: data.generated_games[gameIndex].game_type,
        });
        setIsModalOpen(true);
    };

    const handleOpenAddModal = (gameIndex) => {
        setEditingItem({
            gameIndex,
            itemIndex: null,
            data: null,
            gameType: data.generated_games[gameIndex].game_type,
        });
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleModalSave = (values) => {
        if (!editingItem) return;
        const { gameIndex, itemIndex, gameType } = editingItem;

        // Format dữ liệu theo gameType trước khi lưu
        let formatted = {};
        switch (gameType) {
            case 'multiple_choice_abcd':
                formatted = {
                    question_text: values.question_text || '',
                    options: Array.isArray(values.options) ? values.options.map(o => (o == null ? '' : o)) : [],
                    correct_answer_index: Number.isFinite(values.correct_answer_index ? Number(values.correct_answer_index) : 0)
                        ? Number(values.correct_answer_index)
                        : 0,
                };
                // clamp index
                if (formatted.correct_answer_index < 0) formatted.correct_answer_index = 0;
                if (formatted.correct_answer_index >= formatted.options.length) formatted.correct_answer_index = Math.max(0, formatted.options.length - 1);
                break;
            case 'true_false':
                formatted = {
                    statement_text: values.statement_text || '',
                    is_true: !!values.is_true,
                };
                break;
            case 'fill_in_the_blank':
                formatted = {
                    sentence_with_blank: values.sentence_with_blank || '',
                    answer: values.answer || '',
                };
                break;
            case 'matching':
                formatted = {
                    instruction: values.instruction || '',
                    pairs: Array.isArray(values.pairs) ? values.pairs.map(p => ({ item_a: p.item_a || '', item_b: p.item_b || '' })) : [],
                };
                break;
            case 'flashcards':
                formatted = {
                    deck_title: values.deck_title || '',
                    cards: Array.isArray(values.cards) ? values.cards.map(c => ({ front: c.front || '', back: c.back || '' })) : [],
                };
                break;
            case 'sorting':
                formatted = {
                    instruction: values.instruction || '',
                    categories: Array.isArray(values.categories) ? values.categories.map(cat => ({
                        category_name: cat.category_name || '',
                        items: Array.isArray(cat.items) ? cat.items.map(i => (i == null ? '' : i)) : [],
                    })) : [],
                };
                break;
            default:
                formatted = values;
                break;
        }

        if (itemIndex === null) {
            addItem(gameIndex, formatted);
            message.success('Đã thêm mới!');
        } else {
            updateItem(gameIndex, itemIndex, formatted);
            message.success('Đã cập nhật!');
        }

        handleModalClose();
    };

    const handleDeleteItem = (gameIndex, itemIndex) => {
        deleteItem(gameIndex, itemIndex);
        message.success('Đã xóa thành công!');
    };

    const handleChangePage = () => {
        message.success('Chuyển đến trang học sinh để xuất bộ đề');
        navigate('/student');
    };

    const tabItems = data.generated_games.map((game, index) => ({
        key: index.toString(),
        label: (
            <Space>
                {getGameTypeIcon(game.game_type)}
                {getGameTypeName(game.game_type)}
            </Space>
        ),
        children: (
            <div style={{ padding: '0 16px' }}>
                {renderGameContent(game, index, handleOpenEditModal, handleDeleteItem)}
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
    }));

    return (
        <>
            <Drawer
                title={<Text style={{ fontSize: 18, fontWeight: 600 }}>{data.lesson_title}</Text>}
                placement="right"
                width={'70%'}
                onClose={onClose}
                open={open}
                extra={
                    <Space>
                        <Button type="primary" onClick={handleChangePage}>
                            Xuất bộ đề
                        </Button>
                    </Space>
                }
            >
                <Tabs defaultActiveKey="0" tabPosition="left" items={tabItems} style={{ height: '100%' }} />
            </Drawer>

            <Modal
                title={editingItem?.itemIndex === null ? 'Thêm bài tập mới' : 'Chỉnh sửa bài tập'}
                open={isModalOpen}
                onCancel={handleModalClose}
                footer={null}
                width={800}
            >
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
