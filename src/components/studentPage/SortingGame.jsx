// src/components/studentPage/SortingGame.jsx

import React, { useState, useEffect } from 'react';
import { Space, Button, Typography, Alert, Card, Row, Col, message } from 'antd';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    useDraggable,
    useDroppable,
} from '@dnd-kit/core';

const { Title, Text } = Typography;

// --- 1. Component Item (Thẻ kéo) ---
function DraggableItem({ id, children, result, isDragging }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: id,
    });

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    };

    let className = "sortable-item";
    if (isDragging) className += " is-dragging";
    if (result === 'correct') className += " correct";
    if (result === 'incorrect') className += " incorrect";

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={className}>
            {children}
        </div>
    );
}

// --- 2. Component Khung (Nơi thả) ---
function DroppableContainer({ id, title, children, isOver, isChecked }) {
    const { setNodeRef } = useDroppable({ id });

    let className = "category-bin";
    if (isOver) className += " is-over";
    if (isChecked) className += " checked";

    return (
        <div ref={setNodeRef} className={className}>
            <Title level={5} style={{ width: '100%', textAlign: 'center', marginTop: 0, color: '#8c8c8c' }}>
                {title}
            </Title>
            {children}
        </div>
    );
}

// --- 3. Component Game Chính ---
function SortingGame({ gameData }) {
    // State lưu tất cả các item
    const [allItems, setAllItems] = useState([]);
    // State lưu vị trí của các item
    const [placements, setPlacements] = useState({});

    // State logic
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [results, setResults] = useState({}); // { "7 + 5": 'correct', ... }
    const [activeId, setActiveId] = useState(null); // Item đang được kéo

    // ID của khu vực chờ
    const ITEM_BANK_ID = 'item-bank';

    // Khởi tạo/Làm phẳng dữ liệu
    useEffect(() => {
        // 1. Làm phẳng data
        const flatItems = gameData.categories.flatMap(cat =>
            cat.items.map(item => ({
                id: item, // "7 + 5"
                content: item,
                correctCategory: cat.category_name
            }))
        );
        setAllItems(flatItems);

        // 2. Tạo state vị trí ban đầu
        const initialPlacements = {
            [ITEM_BANK_ID]: flatItems.map(item => item.id), // Tất cả item bắt đầu ở bank
        };
        gameData.categories.forEach(cat => {
            initialPlacements[cat.category_name] = []; // Các category ban đầu rỗng
        });
        setPlacements(initialPlacements);

        // 3. Reset state
        setIsSubmitted(false);
        setResults({});
    }, [gameData]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    );

    // Tìm container (khung) của một item
    const findContainer = (itemId) => {
        return Object.keys(placements).find(key => placements[key].includes(itemId));
    };

    // --- 4. Xử lý Kéo/Thả ---
    function handleDragStart(event) {
        setActiveId(event.active.id);
    }

    function handleDragEnd(event) {
        const { active, over } = event;
        setActiveId(null);

        if (over && active.id !== over.id) {
            const sourceContainer = findContainer(active.id);
            const targetContainer = over.id;

            if (sourceContainer !== targetContainer) {
                setPlacements((prev) => {
                    const newPlacements = { ...prev };

                    // Xóa item khỏi container cũ
                    newPlacements[sourceContainer] = prev[sourceContainer].filter(id => id !== active.id);
                    // Thêm item vào container mới
                    newPlacements[targetContainer] = [...prev[targetContainer], active.id];

                    return newPlacements;
                });
            }
        }
    }

    // --- 5. Xử lý Nút Kiểm Tra ---
    function handleCheckAnswers() {
        if (placements[ITEM_BANK_ID].length > 0) {
            message.warning('Vui lòng kéo tất cả các phép tính vào nhóm tương ứng!');
            return;
        }

        let newResults = {};
        // eslint-disable-next-line no-unused-vars
        let correctCount = 0;

        allItems.forEach(item => {
            const userCategory = findContainer(item.id);
            if (userCategory === item.correctCategory) {
                newResults[item.id] = 'correct';
                correctCount++;
            } else {
                newResults[item.id] = 'incorrect';
            }
        });

        setResults(newResults);
        setIsSubmitted(true);
    }

    // --- 6. Xử lý Làm Lại ---
    function handleReset() {
        // Reset về trạng thái ban đầu
        const initialPlacements = {
            [ITEM_BANK_ID]: allItems.map(item => item.id),
        };
        gameData.categories.forEach(cat => {
            initialPlacements[cat.category_name] = [];
        });
        setPlacements(initialPlacements);
        setIsSubmitted(false);
        setResults({});
    }

    // Hàm để render các item bên trong một container
    const renderItemsInContainer = (containerId) => {
        return placements[containerId]?.map(itemId => {
            const item = allItems.find(i => i.id === itemId);
            if (!item) return null;

            return (
                <DraggableItem
                    key={item.id}
                    id={item.id}
                    result={isSubmitted ? results[item.id] : undefined}
                    isDragging={activeId === item.id}
                >
                    {item.content}
                </DraggableItem>
            );
        });
    };

    return (
        <Card>
            <Alert message={gameData.instruction} type="info" style={{ marginBottom: 24 }} />

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="sorting-game-container">
                    {/* Khu vực chứa các khung category */}
                    <Row gutter={[16, 16]}>
                        {gameData.categories.map(cat => (
                            <Col xs={24} md={8} key={cat.category_name}>
                                <DroppableContainer
                                    id={cat.category_name}
                                    title={cat.category_name}
                                    isChecked={isSubmitted}
                                >
                                    {renderItemsInContainer(cat.category_name)}
                                </DroppableContainer>
                            </Col>
                        ))}
                    </Row>

                    <hr />

                    {/* Khu vực chờ (Item Bank) */}
                    <DroppableContainer
                        id={ITEM_BANK_ID}
                        title="Khu vực chờ (Kéo các thẻ từ đây)"
                        isOver={activeId && findContainer(activeId) !== ITEM_BANK_ID}
                    >
                        {renderItemsInContainer(ITEM_BANK_ID)}
                    </DroppableContainer>
                </div>
            </DndContext>

            {/* Thanh Điều Hướng */}
            <Space style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
                {!isSubmitted ? (
                    <Button type="primary" size="large" onClick={handleCheckAnswers}>
                        Kiểm tra
                    </Button>
                ) : (
                    <Button size="large" onClick={handleReset}>
                        Làm lại
                    </Button>
                )}
            </Space>

            {/* Thông báo kết quả */}
            {isSubmitted && (
                <Alert
                    message={`Kết quả: Bạn đã sắp xếp đúng ${Object.values(results).filter(r => r === 'correct').length}/${allItems.length} phép tính.`}
                    type="info"
                    style={{ marginTop: 16 }}
                    showIcon
                />
            )}
        </Card>
    );
}

export default SortingGame;