// src/components/studentPage/FlashcardGame.jsx

import React, { useState, useEffect } from 'react';
import { Space, Button, Typography, Card, Progress } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const { Title } = Typography;

function FlashcardGame({ gameData }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    // State mới: để biết thẻ có đang bị lật hay không
    const [isFlipped, setIsFlipped] = useState(false);

    // Thay đổi: dùng 'cards'
    const totalCards = gameData.cards.length;
    const currentCard = gameData.cards[currentIndex];

    useEffect(() => {
        // Reset state khi gameData thay đổi
        setCurrentIndex(0);
        setIsFlipped(false);
    }, [gameData]);

    // Hàm chính: Lật thẻ
    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    // Khi chuyển thẻ, luôn reset về mặt trước
    const goToNext = () => {
        if (currentIndex < totalCards - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsFlipped(false); // Reset lật
        }
    };

    const goToPrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setIsFlipped(false); // Reset lật
        }
    };

    const progressPercent = Math.round(((currentIndex + 1) / totalCards) * 100);

    return (
        <Card>
            {/* 1. Thanh Tiến Trình */}
            <Progress
                percent={progressPercent}
                format={() => `Thẻ ${currentIndex + 1} / ${totalCards}`}
                style={{ marginBottom: 24 }}
            />

            {/* 2. Thẻ Flashcard */}
            <Title level={5} style={{ marginBottom: 16, textAlign: 'center' }}>
                {gameData.deck_title} - Nhấp vào thẻ để lật
            </Title>
            <div className="flashcard-container" onClick={handleFlip}>
                <div className={`flashcard ${isFlipped ? 'is-flipped' : ''}`}>
                    <div className="flashcard-front">
                        {currentCard.front}
                    </div>
                    <div className="flashcard-back">
                        {currentCard.back}
                    </div>
                </div>
            </div>

            {/* 3. Thanh Điều Hướng */}
            <Space style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
                <Button
                    icon={<LeftOutlined />}
                    onClick={goToPrev}
                    disabled={currentIndex === 0}
                >
                    Thẻ trước
                </Button>

                <Button
                    type="primary"
                    icon={<RightOutlined />}
                    onClick={goToNext}
                    disabled={currentIndex === totalCards - 1}
                >
                    Thẻ tiếp
                </Button>
            </Space>
        </Card>
    );
}

export default FlashcardGame;