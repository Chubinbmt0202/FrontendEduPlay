// src/components/studentPage/TrueFalseGame.jsx

import React, { useState, useEffect } from 'react';
import { Radio, Space, Button, Typography, Alert, Card, Progress, Row, Col, message } from 'antd';
import { CheckCircleFilled, CloseCircleFilled, LeftOutlined, RightOutlined } from '@ant-design/icons';

const { Title } = Typography;

// --- 1. ĐỊNH NGHĨA CÁC STYLE MÀU SẮC ---
// (Copy y hệt từ file MultipleChoiceGame)
const selectedStyle = {
    backgroundColor: '#1677ff', // Xanh dương
    color: 'white',
    borderColor: '#1677ff',
    opacity: 1,
};
const correctStyle = {
    backgroundColor: '#52c41a', // Xanh lá
    color: 'white',
    borderColor: '#52c41a',
    opacity: 1,
};
const incorrectStyle = {
    backgroundColor: '#f5222d', // Đỏ
    color: 'white',
    borderColor: '#f5222d',
    opacity: 1,
};
const mutedStyle = {
    opacity: 0.6,
};
// ------------------------------------------

function TrueFalseGame({ gameData }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { 0: true, 1: false, ... }
    const [results, setResults] = useState({}); // { 0: 'correct', 1: 'incorrect', ... }

    // State logic (giữ nguyên)
    const [currentAnswerChecked, setCurrentAnswerChecked] = useState(false);
    const [isQuizFinished, setIsQuizFinished] = useState(false);

    // Thay đổi: dùng 'statements'
    const totalQuestions = gameData.statements.length;
    const currentQuestion = gameData.statements[currentQuestionIndex];

    useEffect(() => {
        setCurrentQuestionIndex(0);
        setAnswers({});
        setResults({});
        setCurrentAnswerChecked(false);
        setIsQuizFinished(false);
    }, [gameData]);

    // Hàm xử lý chọn đáp án (value là true/false)
    const handleAnswerChange = (answerValue) => {
        if (currentAnswerChecked || isQuizFinished) return;
        setAnswers({
            ...answers,
            [currentQuestionIndex]: answerValue,
        });
    };

    // Hàm xử lý nút chính (giữ nguyên logic, chỉ đổi tên biến)
    const handleMainButton = () => {
        if (!currentAnswerChecked) {
            if (answers[currentQuestionIndex] === undefined) {
                message.warning('Vui lòng chọn "Đúng" hoặc "Sai"!');
                return;
            }

            // Thay đổi: so sánh với 'is_true'
            const isCorrect = answers[currentQuestionIndex] === currentQuestion.is_true;

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

    // --- 2. HÀM STYLE ĐỘNG (Điều chỉnh cho Đúng/Sai) ---
    const getButtonStyle = (optionValue) => { // optionValue sẽ là true hoặc false
        const baseStyle = {
            width: '100%', fontSize: 16, minHeight: '70px',
            height: 'auto', display: 'flex', alignItems: 'center',
            justifyContent: 'center', whiteSpace: 'normal', lineHeight: '1.4'
        };

        const isUserSelection = (optionValue === answers[currentQuestionIndex]);
        // Thay đổi: so sánh với 'is_true'
        const isCorrectAnswer = (optionValue === currentQuestion.is_true);

        // Trạng thái 1: CHƯA "Kiểm tra"
        if (!currentAnswerChecked && !isQuizFinished) {
            if (isUserSelection) {
                return { ...baseStyle, ...selectedStyle };
            }
            return baseStyle;
        }

        // Trạng thái 2: ĐÃ "Kiểm tra" hoặc "Nộp bài"
        if (isCorrectAnswer) {
            return { ...baseStyle, ...correctStyle }; // Đáp án đúng -> Xanh lá
        }
        if (isUserSelection && results[currentQuestionIndex] === 'incorrect') {
            return { ...baseStyle, ...incorrectStyle }; // User chọn sai -> Đỏ
        }
        return { ...baseStyle, ...mutedStyle }; // Nút còn lại -> Mờ
    };

    const correctCount = Object.values(results).filter(r => r === 'correct').length;
    const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

    return (
        <Card>
            {/* 1. Thanh Tiến Trình */}
            <Progress
                percent={progressPercent}
                format={() => isQuizFinished ? `Đã hoàn thành` : `Câu ${currentQuestionIndex + 1} / ${totalQuestions}`}
                style={{ marginBottom: 24 }}
            />

            {/* 2. Nội Dung Câu Hỏi (Thay đổi) */}
            <div style={{ width: '100%' }}>
                <Title level={5} style={{ minHeight: 60, marginBottom: 24 }}>
                    <Space>
                        {isQuizFinished && (
                            results[currentQuestionIndex] === 'correct' ? (
                                <CheckCircleFilled style={{ color: 'green' }} />
                            ) : (
                                <CloseCircleFilled style={{ color: 'red' }} />
                            )
                        )}
                        {/* Thay đổi: dùng 'statement_text' */}
                        {currentQuestion.statement_text}
                    </Space>
                </Title>
                <Radio.Group
                    value={answers[currentQuestionIndex]}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    style={{ width: '100%' }}
                    disabled={currentAnswerChecked || isQuizFinished}
                >
                    {/* Thay đổi: Chỉ 2 nút Đúng/Sai */}
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Radio.Button
                                value={true} // Giá trị là boolean true
                                style={getButtonStyle(true)}
                            >
                                Đúng
                            </Radio.Button>
                        </Col>
                        <Col span={12}>
                            <Radio.Button
                                value={false} // Giá trị là boolean false
                                style={getButtonStyle(false)}
                            >
                                Sai
                            </Radio.Button>
                        </Col>
                    </Row>
                </Radio.Group>
            </div>

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

export default TrueFalseGame;