// src/components/studentPage/SortingGame.jsx

import React, { useState, useEffect } from 'react';
import { Space, Button, Typography, Alert, Card, Row, Col } from 'antd';
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
import CorrectSound from '../../../assets/sound/correct.mp3';
import IncorrectSound from '../../../assets/sound/incorrect.mp3';

const { Title } = Typography;

// --- 1. Component Thẻ kéo ---
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

// --- 2. Component Ô thả ---
function DroppableContainer({ id, title, children }) {
    const { setNodeRef, isOver } = useDroppable({ id });

    let className = "category-bin";
    if (isOver) className += " is-over";

    return (
        <div ref={setNodeRef} className={className}>
            <Title level={5} style={{ textAlign: 'center', marginTop: 0, color: '#8c8c8c' }}>
                {title}
            </Title>
            {children}
        </div>
    );
}

// --- 3. Trò chơi chính ---
function SortingGame({ gameData }) {
    const [allItems, setAllItems] = useState([]);
    const [placements, setPlacements] = useState({});
    const [results, setResults] = useState({});
    const [activeId, setActiveId] = useState(null);
    const [categoriesToRender, setCategoriesToRender] = useState([]); // <--- ĐÃ THÊM

    const ITEM_BANK_ID = 'item-bank';

    useEffect(() => {
        console.log("Khởi tạo SortingGame với dữ liệu:", gameData);

        // --- BƯỚC CHUẨN HÓA DỮ LIỆU BỊ NHÚNG NHẦM (NESTED DATA) ---
        let normalizedCategories = [];

        if (Array.isArray(gameData.categories)) {
            gameData.categories.forEach(item => {
                // Kiểm tra xem đối tượng có phải là một bài tập bị nhúng (có thuộc tính 'categories' là mảng)
                if (item && Array.isArray(item.categories)) {
                    // Nâng các categories con lên (Flatten)
                    normalizedCategories.push(...item.categories);
                } else if (item && item.category_name && Array.isArray(item.items)) {
                    // Nếu là một category hợp lệ, thêm nó vào mảng
                    normalizedCategories.push(item);
                }
            });
        }

        // Nếu sau khi chuẩn hóa không có categories nào, sử dụng mảng rỗng để tránh lỗi.
        const finalCategories = normalizedCategories.length > 0 ? normalizedCategories : [];
        // --------------------------------------------------------------------------

        // --- LƯU STATE CHO VIỆC RENDER ---
        setCategoriesToRender(finalCategories); // <--- ĐÃ THÊM

        // 1. Tạo danh sách tất cả các mục (flatItems)
        const flatItems = finalCategories.flatMap(cat =>
            cat.items.map(item => ({
                id: item, // Giả sử item là duy nhất
                content: item,
                correctCategory: cat.category_name
            }))
        );
        setAllItems(flatItems);

        // 2. Tạo vị trí ban đầu (initialPlacements)
        const initialPlacements = { [ITEM_BANK_ID]: flatItems.map(item => item.id) };

        finalCategories.forEach(cat => {
            initialPlacements[cat.category_name] = [];
        });

        setPlacements(initialPlacements);
        setResults({});

    }, [gameData]);

    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

    // ... (Các hàm findContainer, handleDragStart, handleDragEnd giữ nguyên)

    const findContainer = (itemId) => {
        return Object.keys(placements).find(key => placements[key].includes(itemId));
    };

    function handleDragStart(event) {
        setActiveId(event.active.id);
    }

    function handleDragEnd(event) {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const sourceContainer = findContainer(active.id);
        const targetContainer = over.id;
        if (!targetContainer || sourceContainer === targetContainer) return;

        const item = allItems.find(i => i.id === active.id);
        const isCorrect = item.correctCategory === targetContainer;

        if (isCorrect) {
            // ✅ Nếu đúng
            const correctAudio = new Audio(CorrectSound);
            correctAudio.play();
            setPlacements((prev) => {
                const newP = { ...prev };
                newP[sourceContainer] = prev[sourceContainer].filter(id => id !== active.id);
                newP[targetContainer] = [...prev[targetContainer], active.id];
                return newP;
            });
            setResults((prev) => ({ ...prev, [active.id]: 'correct' }));
        } else {
            const incorrectAudio = new Audio(IncorrectSound);
            incorrectAudio.play();
            // ❌ Nếu sai: hiện đỏ 1s rồi quay về bank
            setResults((prev) => ({ ...prev, [active.id]: 'incorrect' }));
            setTimeout(() => {
                setResults((prev) => {
                    const { [active.id]: _, ...rest } = prev;
                    return rest;
                });
                setPlacements((prev) => {
                    const newP = { ...prev };
                    // xóa khỏi ô sai (nếu có)
                    Object.keys(newP).forEach(key => {
                        newP[key] = newP[key].filter(id => id !== active.id);
                    });
                    // đưa về bank
                    newP[ITEM_BANK_ID] = [...newP[ITEM_BANK_ID], active.id];
                    return newP;
                });
            }, 1000);
        }
    }

    // Hàm render item trong từng ô
    const renderItemsInContainer = (containerId) => {
        return placements[containerId]?.map(itemId => {
            const item = allItems.find(i => i.id === itemId);
            if (!item) return null;
            return (
                <DraggableItem
                    key={item.id}
                    id={item.id}
                    result={results[item.id]}
                    isDragging={activeId === item.id}
                >
                    {item.content}
                </DraggableItem>
            );
        });
    };

    return (
        <Card>
            <Alert message={gameData.instruction || "Kéo các thẻ vào nhóm đúng"} type="info" style={{ marginBottom: 24 }} />

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="sorting-game-container">
                    <Row gutter={[16, 16]}>
                        {categoriesToRender.map(cat => ( // <--- ĐÃ SỬ DỤNG categoriesToRender
                            <Col xs={24} md={8} key={cat.category_name}>
                                <DroppableContainer id={cat.category_name} title={cat.category_name}>
                                    {renderItemsInContainer(cat.category_name)}
                                </DroppableContainer>
                            </Col>
                        ))}
                    </Row>

                    <hr />

                    <DroppableContainer id={ITEM_BANK_ID} title="Khu vực chờ">
                        {renderItemsInContainer(ITEM_BANK_ID)}
                    </DroppableContainer>
                </div>
            </DndContext>
        </Card>
    );
}

export default SortingGame;