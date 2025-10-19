// src/components/studentPage/FillInTheBlankGame.jsx

import React, { useState, useEffect } from 'react';
import { Input, Space, Button, Typography, Alert, Card, Progress, message } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

function FillInTheBlankGame({ gameData }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { 0: "đáp án A", 1: "đáp án B" }
    const [results, setResults] = useState({}); // { 0: 'correct', 1: 'incorrect' }

    // State logic (giữ nguyên)
    const [currentAnswerChecked, setCurrentAnswerChecked] = useState(false);
    const [isQuizFinished, setIsQuizFinished] = useState(false);

    // Thay đổi: dùng 'sentences'
    const totalQuestions = gameData.sentences.length;
    const currentQuestion = gameData.sentences[currentQuestionIndex];

    // Tách câu hỏi thành 2 phần (trước và sau dấu '___')
    const questionParts = currentQuestion.sentence_with_blank.split('___');

    useEffect(() => {
        setCurrentQuestionIndex(0);
        setAnswers({});
        setResults({});
        setCurrentAnswerChecked(false);
        setIsQuizFinished(false);
    }, [gameData]);

    // Hàm xử lý khi nhập text
    const handleAnswerChange = (e) => {
        if (currentAnswerChecked || isQuizFinished) return;
        setAnswers({
            ...answers,
            [currentQuestionIndex]: e.target.value,
        });
    };

    // Hàm xử lý nút chính
    const handleMainButton = () => {
        const userAnswer = answers[currentQuestionIndex];

        if (!currentAnswerChecked) {
            // Kiểm tra xem đã nhập chưa
            if (!userAnswer || userAnswer.trim() === '') {
                message.warning('Vui lòng nhập đáp án!');
                return;
            }

            // Kiểm tra đáp án (không phân biệt hoa thường, bỏ khoảng trắng)
            const isCorrect = userAnswer.trim().toLowerCase() === currentQuestion.answer.toLowerCase();

            setResults(prev => ({
                ...prev,
                [currentQuestionIndex]: isCorrect ? 'correct' : 'incorrect'
            }));
            setCurrentAnswerChecked(true); // Đã kiểm tra
        } else {
            // Chuyển câu
            if (currentQuestionIndex < totalQuestions - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setCurrentAnswerChecked(false); // Reset cho câu mới
            } else {
                // Nộp bài
                setIsQuizFinished(true);
                setCurrentQuestionIndex(0);
                setCurrentAnswerChecked(false);
            }
        }
    };

    // Điều hướng (giữ nguyên)
    const goToNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };
    const goToPrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const correctCount = Object.values(results).filter(r => r === 'correct').length;
    const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);
    const currentResult = results[currentQuestionIndex];

    return (
        <Card>
            {/* 1. Thanh Tiến Trình */}
            <Progress
                percent={progressPercent}
                format={() => isQuizFinished ? `Đã hoàn thành` : `Câu ${currentQuestionIndex + 1} / ${totalQuestions}`}
                style={{ marginBottom: 24 }}
            />

            {/* 2. Nội Dung Câu Hỏi */}
            <div style={{ width: '100%' }}>
                <Title level={5} style={{ minHeight: 60, marginBottom: 24, fontSize: 20 }}>
                    {/* Hiển thị câu hỏi với ô input ở giữa */}
                    <Space align="center" style={{ flexWrap: 'wrap' }}>
                        <Text style={{ fontSize: 'inherit' }}>{questionParts[0]}</Text>
                        <Input
                            placeholder="Nhập đáp án"
                            value={answers[currentQuestionIndex] || ''}
                            onChange={handleAnswerChange}
                            disabled={currentAnswerChecked || isQuizFinished}
                            style={{
                                width: 200,
                                textAlign: 'center',
                                fontSize: 18,
                                // Đổi màu viền dựa trên kết quả
                                borderColor: currentAnswerChecked ? (currentResult === 'correct' ? '#52c41a' : '#f5222d') : '#d9d9d9',
                                borderWidth: currentAnswerChecked ? 2 : 1,
                            }}
                        />
                        <Text style={{ fontSize: 'inherit' }}>{questionParts[1]}</Text>
                    </Space>
                </Title>

                {/* 3. Hiển thị Feedback (Chỉ sau khi "Kiểm tra") */}
                <div style={{ minHeight: 80 }}>
                    {currentAnswerChecked && !isQuizFinished && (
                        currentResult === 'correct' ? (
                            <Alert
                                message="Chính xác!"
                                type="success"
                                showIcon
                            />
                        ) : (
                            <Alert
                                message={
                                    <span>
                                        Chưa đúng. Đáp án đúng là: <Text strong>{currentQuestion.answer}</Text>
                                    </span>
                                }
                                type="error"
                                showIcon
                            />
                        )
                    )}
                    {/* Hiển thị feedback khi review */}
                    {isQuizFinished && (
                        currentResult === 'correct' ? (
                            <Alert
                                message={<span>Bạn đã trả lời đúng: <Text strong>{currentQuestion.answer}</Text></span>}
                                type="success"
                                showIcon
                            />
                        ) : (
                            <Alert
                                message={
                                    <span>
                                        Bạn đã trả lời: <Text strong delete>{answers[currentQuestionIndex]}</Text>.
                                        Đáp án đúng là: <Text strong>{currentQuestion.answer}</Text>
                                    </span>
                                }
                                type="error"
                                showIcon
                            />
                        )
                    )}
                </div>
            </div>

            {/* 4. Thanh Điều Hướng (Giữ nguyên logic) */}
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

            {/* 5. Thông báo kết quả (chỉ hiển thị sau khi nộp) */}
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

export default FillInTheBlankGame;