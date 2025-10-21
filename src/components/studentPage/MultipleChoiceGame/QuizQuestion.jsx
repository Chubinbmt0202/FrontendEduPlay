// src/components/studentPage/QuizQuestion.jsx

import React from 'react';
import { Radio, Typography, Space, Row, Col } from 'antd';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import CorectSound from '../../../assets/sound/correct.mp3';
import InCorrectSound from '../../../assets/sound/incorrect.mp3';

// 1. THÊM LẠI: Import các style màu sắc từ file styles.js
// import { selectedStyle, correctStyle, incorrectStyle, mutedStyle } from './styles';

const { Title } = Typography;

// 2. THÊM LẠI: Hàm logic quyết định màu sắc cho nút
// Hàm này RẤT QUAN TRỌNG
// 🎨 Hàm xác định màu sắc & hiệu ứng cho từng nút đáp án
const getButtonStyle = (
    optionIndex,
    question,
    userAnswer,
    result,
    isFinished,
    isChecked
) => {
    const baseStyle = {
        width: '100%',
        fontSize: 16,
        minHeight: '70px',
        height: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        whiteSpace: 'normal',
        lineHeight: '1.4',
        borderRadius: '12px',
        transition: 'all 0.25s ease-in-out',
        fontWeight: 500
    };

    const isUserSelection = optionIndex === userAnswer;
    const isCorrectAnswer = optionIndex === Number(question.correct_answer_index);

    // 🟢 TRẠNG THÁI 1: ĐÃ NỘP BÀI (Review)
    if (isFinished) {
        if (isCorrectAnswer) {
            return {
                ...baseStyle,
                backgroundColor: '#d1f7d6',
                borderColor: '#4CAF50',
                color: '#2e7d32',
                boxShadow: '0 0 10px rgba(76,175,80,0.3)'
            };
        }
        if (isUserSelection && result === 'incorrect') {
            return {
                ...baseStyle,
                backgroundColor: '#ffebee',
                borderColor: '#f44336',
                color: '#c62828',
                boxShadow: '0 0 10px rgba(244,67,54,0.25)'
            };
        }
        return {
            ...baseStyle,
            opacity: 0.6,
            backgroundColor: '#f8f9fa',
            borderColor: '#ddd',
            color: '#666'
        };
    }

    if (isChecked) {
        if (isCorrectAnswer) {
            const audio = new Audio(CorectSound);
            audio.play();

            return {
                ...baseStyle,
                backgroundColor: '#d1f7d6',
                borderColor: '#4CAF50',
                color: '#2e7d32',
                boxShadow: '0 0 10px rgba(76,175,80,0.3)'
            };
        }

        if (isUserSelection && result === 'incorrect') {
            // const audio = new Audio(InCorrectSound);
            // audio.play();
            return {
                ...baseStyle,
                backgroundColor: '#ffebee',
                borderColor: '#f44336',
                color: '#c62828',
                boxShadow: '0 0 10px rgba(244,67,54,0.25)'
            };
        }

        // Các đáp án khác giữ mờ
        return {
            ...baseStyle,
            opacity: 0.6,
            backgroundColor: '#f8f9fa',
            borderColor: '#ddd',
            color: '#666'
        };
    }


    // 🔵 TRẠNG THÁI 3: ĐANG CHƠI (Chưa kiểm tra)
    if (isUserSelection && result === 'incorrect') {
        // Người dùng chọn sai (sau khi kiểm tra) -> Đỏ
        const audio = new Audio(InCorrectSound);
        audio.play();
        return {
            ...baseStyle,
            backgroundColor: '#ffebee',
            borderColor: '#f44336',
            color: '#c62828',
            boxShadow: '0 0 8px rgba(244,67,54,0.25)'
        };
    }

    if (isUserSelection) {
        // Đang chọn nhưng chưa kiểm tra -> Màu trung tính (xanh dương nhẹ)
        return {
            ...baseStyle,
            backgroundColor: '#e3f2fd',
            borderColor: '#2196F3',
            color: '#0d47a1',
            boxShadow: '0 0 8px rgba(33,150,243,0.25)'
        };
    }


    if (isUserSelection) {
        // Đang chọn nhưng chưa kiểm tra -> Xanh dương
        return {
            ...baseStyle,
            backgroundColor: '#e3f2fd',
            borderColor: '#2196F3',
            color: '#0d47a1',
            boxShadow: '0 0 8px rgba(33,150,243,0.25)'
        };
    }

    // ⚪ Bình thường (chưa chọn)
    return {
        ...baseStyle,
        backgroundColor: '#fff',
        borderColor: '#ccc',
        color: '#333'
    };
};



function QuizQuestion({
    question,
    questionIndex,
    userAnswer,
    result,
    isFinished,
    isChecked, // (currentAnswerChecked)
    onAnswerChange
}) {
    // Giữ lại console.log của bạn để debug
    console.log('Rendering QuizQuestion:', questionIndex, 'User Answer:', userAnswer, 'Result:', result, 'isFinished:', isFinished, 'isChecked:', isChecked);

    return (
        <div style={{ width: '100%' }}>
            <Title level={5} style={{ minHeight: 60, marginBottom: 24 }}>
                <Space>
                    {/* Hiển thị icon Đúng/Sai khi review */}
                    {isFinished && (
                        result === 'correct' ? (
                            <CheckCircleFilled style={{ color: 'green' }} />
                        ) : (
                            <CloseCircleFilled style={{ color: 'red' }} />
                        )
                    )}
                    {`Câu ${questionIndex + 1}: ${question.question_text}`}
                </Space>
            </Title>
            <Radio.Group
                value={userAnswer}
                onChange={(e) => onAnswerChange(e.target.value)}
                style={{ width: '100%' }}
                // Bị vô hiệu hóa khi: Đã nộp BÀI, hoặc đã trả lời ĐÚNG
                disabled={isChecked || isFinished}
            >
                <Row gutter={[16, 16]}>
                    {question.options.map((opt, i) => (
                        <Col span={12} key={i}>
                            <Radio.Button
                                value={i}
                                // 3. THÊM LẠI: Prop "style" bị mất
                                // Dòng này áp dụng hàm logic style ở trên
                                style={getButtonStyle(
                                    i,
                                    question,
                                    userAnswer,
                                    result,
                                    isFinished,
                                    isChecked
                                )}
                            >
                                {opt}
                            </Radio.Button>
                        </Col>
                    ))}
                </Row>
            </Radio.Group>
        </div>
    );
}

export default QuizQuestion;