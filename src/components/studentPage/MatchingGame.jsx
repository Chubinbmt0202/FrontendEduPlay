// src/components/studentPage/MatchingGame.jsx

import React, { useState, useEffect } from 'react';
import { Radio, Space, Button, Typography, Alert, Card, Progress, Row, Col, message } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// --- 1. ĐỊNH NGHĨA CÁC STYLE MÀU SẮC ---
// (Copy y hệt từ file MultipleChoiceGame)
const selectedStyle = {
    backgroundColor: '#1677ff', color: 'white', borderColor: '#1677ff', opacity: 1,
};
const correctStyle = {
    backgroundColor: '#52c41a', color: 'white', borderColor: '#52c41a', opacity: 1,
};
const incorrectStyle = {
    backgroundColor: '#f5222d', color: 'white', borderColor: '#f5222d', opacity: 1,
};
const mutedStyle = {
    opacity: 0.6,
};
// ------------------------------------------

// --- Hàm xáo trộn mảng ---
const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
};


function MatchingGame({ gameData }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { 0: "15", 1: "13" }
    const [results, setResults] = useState({}); // { 0: 'correct', 1: 'incorrect' }

    // State logic
    const [currentAnswerChecked, setCurrentAnswerChecked] = useState(false);
    const [isQuizFinished, setIsQuizFinished] = useState(false);

    // State mới: Mảng các lựa chọn (item_b) đã được xáo trộn
    const [shuffledOptions, setShuffledOptions] = useState([]);

    // Thay đổi: dùng 'pairs'
    const totalQuestions = gameData.pairs.length;
    const currentQuestion = gameData.pairs[currentQuestionIndex];

    // Effect: Xáo trộn các lựa chọn (item_b) khi component tải
    useEffect(() => {
        // Lấy tất cả các item_b
        const options = gameData.pairs.map(p => p.item_b);
        setShuffledOptions(shuffleArray([...options])); // Xáo trộn 1 bản copy

        // Reset state
        setCurrentQuestionIndex(0);
        setAnswers({});
        setResults({});
        setCurrentAnswerChecked(false);
        setIsQuizFinished(false);
    }, [gameData]);

    // Hàm xử lý chọn đáp án (value là "text" của item_b)
    const handleAnswerChange = (optionText) => {
        if (currentAnswerChecked || isQuizFinished) return;
        setAnswers({
            ...answers,
            [currentQuestionIndex]: optionText,
        });
    };

    // Hàm xử lý nút chính (logic y hệt)
    const handleMainButton = () => {
        if (!currentAnswerChecked) {
            if (answers[currentQuestionIndex] === undefined) {
                message.warning('Vui lòng chọn một đáp án để nối!');
                return;
            }

            // Kiểm tra: so sánh text đã chọn với text item_b đúng
            const isCorrect = answers[currentQuestionIndex] === currentQuestion.item_b;

            setResults(prev => ({
                ...prev,
                [currentQuestionIndex]: isCorrect ? 'correct' : 'incorrect'
            }));
            setCurrentAnswerChecked(true);
        } else {
            if (currentQuestionIndex < totalQuestions - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setCurrentAnswerChecked(false);
            } else {
                setIsQuizFinished(true);
                setCurrentQuestionIndex(0);
                setCurrentAnswerChecked(false);
            }
        }
    };

    const goToNext = () => { /* ... (giữ nguyên) */ };
    const goToPrev = () => { /* ... (giữ nguyên) */ };

    // --- 2. HÀM STYLE ĐỘNG (Điều chỉnh cho text) ---
    const getButtonStyle = (optionText) => {
        const baseStyle = {
            width: '100%', fontSize: 16, minHeight: '50px',
            height: 'auto', display: 'flex', alignItems: 'center',
            justifyContent: 'center', whiteSpace: 'normal', lineHeight: '1.4'
        };

        const isUserSelection = (optionText === answers[currentQuestionIndex]);
        const isCorrectAnswer = (optionText === currentQuestion.item_b);

        // Trạng thái 1: CHƯA "Kiểm tra"
        if (!currentAnswerChecked && !isQuizFinished) {
            if (isUserSelection) return { ...baseStyle, ...selectedStyle };
            return baseStyle;
        }

        // Trạng thái 2: ĐÃ "Kiểm tra" hoặc "Nộp bài"
        if (isCorrectAnswer) return { ...baseStyle, ...correctStyle };
        if (isUserSelection && results[currentQuestionIndex] === 'incorrect') {
            return { ...baseStyle, ...incorrectStyle };
        }
        return { ...baseStyle, ...mutedStyle };
    };

    const correctCount = Object.values(results).filter(r => r === 'correct').length;
    const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

    // Xử lý an toàn nếu currentQuestion chưa kịp tải
    if (!currentQuestion) return null;

    return (
        <Card>
            {/* 1. Thanh Tiến Trình */}
            <Progress
                percent={progressPercent}
                format={() => isQuizFinished ? `Đã hoàn thành` : `Câu ${currentQuestionIndex + 1} / ${totalQuestions}`}
                style={{ marginBottom: 24 }}
            />

            {/* Hiển thị instruction */}
            <Alert message={gameData.instruction} type="info" style={{ marginBottom: 24 }} />

            {/* 2. Nội Dung Câu Hỏi (Layout 2 cột) */}
            <Row gutter={[24, 24]} align="middle">
                {/* CỘT A (Câu hỏi) */}
                <Col xs={24} md={10}>
                    <Title level={5} style={{ textAlign: 'center' }}>Cột A</Title>
                    <Card
                        style={{
                            minHeight: 100,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#fafafa',
                            borderColor: currentAnswerChecked ? (results[currentQuestionIndex] === 'correct' ? '#52c41a' : '#f5222d') : '#d9d9d9',
                            borderWidth: 2,
                        }}
                    >
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                            {currentQuestion.item_a}
                        </Text>
                    </Card>
                </Col>

                {/* CỘT B (Lựa chọn) */}
                <Col xs={24} md={14}>
                    <Title level={5} style={{ textAlign: 'center' }}>Cột B (Chọn 1 đáp án)</Title>
                    <Radio.Group
                        value={answers[currentQuestionIndex]}
                        onChange={(e) => handleAnswerChange(e.target.value)}
                        style={{ width: '100%' }}
                        disabled={currentAnswerChecked || isQuizFinished}
                    >
                        <Space direction="vertical" style={{ width: '100%' }}>
                            {shuffledOptions.map((opt, i) => (
                                <Radio.Button
                                    key={i}
                                    value={opt} // Giá trị là text
                                    style={getButtonStyle(opt)}
                                >
                                    {opt}
                                </Radio.Button>
                            ))}
                        </Space>
                    </Radio.Group>
                </Col>
            </Row>


            {/* 3. Thanh Điều Hướng (Giữ nguyên logic) */}
            <Space style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
                <Button
                    icon={<LeftOutlined />}
                    onClick={goToPrev}
                    disabled={currentQuestionIndex === 0}
                >
                    Câu trước
                </Button>

                {!isQuizFinished && (
                    <Button
                        type="primary"
                        size="large"
                        icon={currentAnswerChecked && currentQuestionIndex < totalQuestions - 1 ? <RightOutlined /> : null}
                        onClick={handleMainButton}
                    >
                        {!currentAnswerChecked ? "Kiểm tra" :
                            (currentQuestionIndex < totalQuestions - 1 ? "Câu tiếp" : "Nộp bài")
                        }
                    </Button>
                )}

                {isQuizFinished && (
                    <Button
                        type="primary"
                        icon={<RightOutlined />}
                        onClick={goToNext}
                        disabled={currentQuestionIndex === totalQuestions - 1}
                    >
                        Câu tiếp
                    </Button>
                )}
            </Space>

            {/* 4. Thông báo kết quả (giữ nguyên) */}
            {isQuizFinished && (
                <Alert
                    message={`Kết quả: Bạn đã trả lời đúng ${correctCount}/${totalQuestions} câu.`}
                    type="info"
                    style={{ marginTop: 16 }}
                    showIcon
                />
            )}
        </Card>
    );
}

export default MatchingGame;