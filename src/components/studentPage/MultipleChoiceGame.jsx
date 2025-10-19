// src/components/studentPage/MultipleChoiceGame.jsx

import React, { useState, useEffect } from 'react';
import { Radio, Space, Button, Typography, Tag, Alert, Card, Progress, Row, Col, message } from 'antd';
import { CheckCircleFilled, CloseCircleFilled, LeftOutlined, RightOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

// --- 1. ĐỊNH NGHĨA CÁC STYLE MÀU SẮC ---
// (Chúng ta sẽ dùng trực tiếp các style này, không cần file CSS)

// Style cho nút đang được CHỌN (TRƯỚC khi "Kiểm tra")
const selectedStyle = {
    backgroundColor: '#1677ff', // Xanh dương (Antd primary)
    color: 'white',
    borderColor: '#1677ff',
    opacity: 1,
};

// Style cho nút ĐÚNG (SAU khi "Kiểm tra")
const correctStyle = {
    backgroundColor: '#52c41a', // Xanh lá
    color: 'white',
    borderColor: '#52c41a',
    opacity: 1,
};

// Style cho nút SAI (SAU khi "Kiểm tra")
const incorrectStyle = {
    backgroundColor: '#f5222d', // Đỏ
    color: 'white',
    borderColor: '#f5222d',
    opacity: 1,
};

// Style cho nút bị mờ đi (SAU khi "Kiểm tra")
const mutedStyle = {
    opacity: 0.6,
};
// ------------------------------------------


function MultipleChoiceGame({ gameData }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { 0: 1, 1: 3, ... }
    const [results, setResults] = useState({}); // { 0: 'correct', 1: 'incorrect', ... }

    // State này theo dõi xem câu hỏi *hiện tại* đã được bấm "Kiểm tra" hay chưa
    const [currentAnswerChecked, setCurrentAnswerChecked] = useState(false);
    // State này theo dõi xem *toàn bộ* bài quiz đã xong và đang ở chế độ review hay chưa
    const [isQuizFinished, setIsQuizFinished] = useState(false);

    const totalQuestions = gameData.questions.length;
    const currentQuestion = gameData.questions[currentQuestionIndex];

    // Reset state khi gameData thay đổi (nếu cần)
    useEffect(() => {
        setCurrentQuestionIndex(0);
        setAnswers({});
        setResults({});
        setCurrentAnswerChecked(false);
        setIsQuizFinished(false);
    }, [gameData]);

    const handleAnswerChange = (answerIndex) => {
        // Không cho phép đổi đáp án nếu đã "Kiểm tra" hoặc đã "Nộp bài"
        if (currentAnswerChecked || isQuizFinished) return;
        setAnswers({
            ...answers,
            [currentQuestionIndex]: answerIndex,
        });
    };

    const handleMainButton = () => {

        // --- A. Nếu state là "Kiểm tra" ---
        if (!currentAnswerChecked) {
            // Kiểm tra xem đã chọn đáp án chưa
            if (answers[currentQuestionIndex] === undefined) {
                message.warning('Vui lòng chọn một đáp án!');
                return;
            }

            // Kiểm tra đáp án
            const isCorrect = answers[currentQuestionIndex] === currentQuestion.correct_answer_index;

            // Lưu kết quả
            setResults(prev => ({
                ...prev,
                [currentQuestionIndex]: isCorrect ? 'correct' : 'incorrect'
            }));

            // Đổi state -> Hiển thị feedback và đổi nút thành "Câu tiếp"
            setCurrentAnswerChecked(true);
        }
        // --- B. Nếu state là "Câu tiếp" hoặc "Nộp bài" ---
        else {
            // B1. Nếu là "Câu tiếp" (chưa phải câu cuối)
            if (currentQuestionIndex < totalQuestions - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setCurrentAnswerChecked(false); // Reset state cho câu mới
            }
            // B2. Nếu là "Nộp bài" (đang ở câu cuối)
            else {
                setIsQuizFinished(true); // Kết thúc quiz
                setCurrentQuestionIndex(0); // Quay về câu 1 để review
                setCurrentAnswerChecked(false); // Tắt state "Kiểm tra"
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
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    // --- 2. HÀM STYLE ĐỘNG MỚI (QUAN TRỌNG) ---
    const getButtonStyle = (optionIndex) => {
        // Style cơ bản cho nút
        const baseStyle = {
            width: '100%', fontSize: 16, minHeight: '70px',
            height: 'auto', display: 'flex', alignItems: 'center',
            justifyContent: 'center', whiteSpace: 'normal', lineHeight: '1.4'
        };

        const isUserSelection = (optionIndex === answers[currentQuestionIndex]);
        const isCorrectAnswer = (optionIndex === currentQuestion.correct_answer_index);

        // ----- TRẠNG THÁI 1: CHƯA "KIỂM TRA" VÀ CHƯA "NỘP BÀI" -----
        if (!currentAnswerChecked && !isQuizFinished) {
            // Nếu là nút đang được user chọn -> MÀU XANH DƯƠNG
            if (isUserSelection) {
                return { ...baseStyle, ...selectedStyle };
            }
            // Nếu không phải nút được chọn -> Mặc định
            return baseStyle;
        }

        // ----- TRẠNG THÁI 2: ĐÃ "KIỂM TRA" HOẶC ĐÃ "NỘP BÀI" -----

        // A. Nút này LÀ đáp án đúng -> Luôn MÀU XANH LÁ
        if (isCorrectAnswer) {
            return { ...baseStyle, ...correctStyle };
        }

        // B. Nút này LÀ đáp án user chọn VÀ BỊ SAI -> MÀU ĐỎ
        if (isUserSelection && results[currentQuestionIndex] === 'incorrect') {
            return { ...baseStyle, ...incorrectStyle };
        }

        // C. Các nút còn lại (không chọn, không phải đáp án đúng) -> Mờ đi
        return { ...baseStyle, ...mutedStyle };
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

            {/* 2. Nội Dung Câu Hỏi Hiện Tại */}
            <div style={{ width: '100%' }}>
                <Title level={5} style={{ minHeight: 60, marginBottom: 24 }}>
                    <Space>
                        {/* Hiển thị icon Đúng/Sai khi review */}
                        {isQuizFinished && (
                            results[currentQuestionIndex] === 'correct' ? (
                                <CheckCircleFilled style={{ color: 'green' }} />
                            ) : (
                                <CloseCircleFilled style={{ color: 'red' }} />
                            )
                        )}
                        {currentQuestion.question_text}
                    </Space>
                </Title>
                <Radio.Group
                    value={answers[currentQuestionIndex]}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    style={{ width: '100%' }}
                    // Disable khi đã "Kiểm tra" hoặc đã "Nộp bài"
                    disabled={currentAnswerChecked || isQuizFinished}
                >
                    <Row gutter={[16, 16]}>
                        {currentQuestion.options.map((opt, i) => (
                            <Col span={12} key={i}>
                                <Radio.Button
                                    value={i}
                                    style={getButtonStyle(i)} // <-- 3. Áp dụng style động
                                >
                                    {opt}
                                </Radio.Button>
                            </Col>
                        ))}
                    </Row>
                </Radio.Group>
            </div>


            {/* 3. Thanh Điều Hướng (ĐÃ BỎ NÚT LÀM LẠI) */}
            <Space style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
                <Button
                    icon={<LeftOutlined />}
                    onClick={goToPrev}
                    // Disable khi là câu 1
                    disabled={currentQuestionIndex === 0}
                >
                    Câu trước
                </Button>

                {/* Nút chính (Kiểm tra / Câu tiếp / Nộp bài) */}
                {/* Chỉ hiển thị nút này khi CHƯA nộp bài */}
                {!isQuizFinished && (
                    <Button
                        type="primary"
                        size="large"
                        icon={currentAnswerChecked && currentQuestionIndex < totalQuestions - 1 ? <RightOutlined /> : null}
                        onClick={handleMainButton}
                    >
                        {/* Logic hiển thị text của nút */}
                        {!currentAnswerChecked ? "Kiểm tra" :
                            (currentQuestionIndex < totalQuestions - 1 ? "Câu tiếp" : "Nộp bài")
                        }
                    </Button>
                )}

                {/* Nút "Câu tiếp" ở chế độ REVIEW (sau khi đã nộp) */}
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

            {/* 4. Thông báo kết quả (chỉ hiển thị sau khi nộp) */}
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

export default MultipleChoiceGame;