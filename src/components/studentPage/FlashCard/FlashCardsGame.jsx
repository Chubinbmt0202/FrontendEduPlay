// src/components/studentPage/FlashcardGame.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Space, Button, Typography, Card, Progress } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import FlipSound from '../../../assets/sound/flipcard.mp3';
import './FlashCardsGame.css';

const { Title } = Typography;

function FlashcardGame({ gameData }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    // State mới: để biết thẻ có đang bị lật hay không
    const [isFlipped, setIsFlipped] = useState(false);
    const finalCards = useMemo(() => {
        let rawCards = Array.isArray(gameData?.cards) ? gameData.cards : [];
        let cardsToRender = [];

        rawCards.forEach(item => {
            // Trường hợp 1: Đối tượng là một bài tập khác bị nhúng (có thuộc tính 'cards' là mảng)
            if (item && Array.isArray(item.cards)) {
                // Nâng các thẻ con lên (Flatten)
                cardsToRender.push(...item.cards);
            }
            // Trường hợp 2: Đối tượng là một thẻ hợp lệ (có front hoặc back)
            else if (item && (item.front || item.back)) {
                cardsToRender.push(item);
            }
        });

        // Chuẩn hóa cuối cùng: Đảm bảo front/back là string và lọc thẻ rỗng
        return cardsToRender
            .map(c => ({ front: c?.front || '', back: c?.back || '' }))
            .filter(c => c.front || c.back); // Lọc bỏ thẻ rỗng hoàn toàn

    }, [gameData]);
    // Thay đổi: dùng 'cards'
    const totalCards = finalCards.length;
    const currentCard = finalCards[currentIndex];

    useEffect(() => {
        // Reset state khi gameData thay đổi
        console.log("FlashcardGame nhận gameData mới:", gameData);
        setCurrentIndex(0);
        setIsFlipped(false);
    }, [gameData]);

    // Hàm chính: Lật thẻ
    const handleFlip = () => {
        const flipAudio = new Audio(FlipSound);
        flipAudio.play();
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
        <Card className='FlashCard'>
            {/* 1. Thanh Tiến Trình */}
            <Progress
                percent={progressPercent}
                format={() => `Thẻ ${currentIndex + 1} / ${totalCards}`}
                style={{ marginBottom: 24 }}
            />

            {/* 2. Thẻ Flashcard */}
            <Title style={{ marginBottom: 16, textAlign: 'center', fontFamily: 'Lexend, sans-serif', fontWeight: '700', color: '#5c5c5cff' }}>
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
                    style={{
                        padding: '20px 30px',
                    }}
                    icon={<LeftOutlined />}
                    onClick={goToPrev}
                    disabled={currentIndex === 0}
                >
                    Thẻ trước
                </Button>

                <Button
                    style={{
                        color: '#fff',
                        backgroundColor: '#4F994C',
                        padding: '20px 30px',
                    }}
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