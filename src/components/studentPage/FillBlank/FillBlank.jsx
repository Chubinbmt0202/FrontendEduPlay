// src/components/studentPage/FillInTheBlankGame/FillInTheBlankGame.jsx

import React, { useState, useEffect } from 'react';
import { Input, Space, Button, Typography, Alert, Card, Progress, message } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { checkAnswer, getInputStyle } from './FillInTheBlankHelpers';
import * as styles from './FillInTheBlankStyles';
import './FillBlank.css';

const { Title, Text } = Typography;

function FillInTheBlankGame({ gameData }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [results, setResults] = useState({});
    const [currentAnswerChecked, setCurrentAnswerChecked] = useState(false);
    const [isQuizFinished, setIsQuizFinished] = useState(false);

    const totalQuestions = gameData.sentences.length;
    const currentQuestion = gameData.sentences[currentQuestionIndex];
    const questionParts = currentQuestion.sentence_with_blank.split('___');

    useEffect(() => {
        setCurrentQuestionIndex(0);
        setAnswers({});
        setResults({});
        setCurrentAnswerChecked(false);
        setIsQuizFinished(false);
    }, [gameData]);

    const handleAnswerChange = (e) => {
        if (currentAnswerChecked || isQuizFinished) return;
        setAnswers({
            ...answers,
            [currentQuestionIndex]: e.target.value,
        });
    };

    const handleMainButton = () => {
        const userAnswer = answers[currentQuestionIndex];

        if (!currentAnswerChecked) {
            if (!userAnswer || userAnswer.trim() === '') {
                message.warning('Vui lòng nhập đáp án!');
                return;
            }

            const isCorrect = checkAnswer(userAnswer, currentQuestion.answer);
            setResults((prev) => ({
                ...prev,
                [currentQuestionIndex]: isCorrect ? 'correct' : 'incorrect',
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
        if (currentQuestionIndex < totalQuestions - 1) setCurrentQuestionIndex(currentQuestionIndex + 1);
    };
    const goToPrev = () => {
        if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1);
    };

    const correctCount = Object.values(results).filter((r) => r === 'correct').length;
    const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);
    const currentResult = results[currentQuestionIndex];

    return (
        <Card className='card-FillBlank'>
            <Progress
                percent={progressPercent}
                format={() =>
                    isQuizFinished ? `Đã hoàn thành` : `Câu ${currentQuestionIndex + 1} / ${totalQuestions}`
                }
                style={{ marginBottom: 24 }}
            />

            <div style={{ width: '100%' }}>
                <Title className='titleName'>
                    <Space align="center" style={{ display: 'flex', alignItems: 'center' }}>
                        <Text className='titleName' style={{ fontSize: 'inherit' }}>{questionParts[0]}</Text>
                        <Input
                            placeholder="Nhập đáp án"
                            value={answers[currentQuestionIndex] || ''}
                            onChange={handleAnswerChange}
                            disabled={currentAnswerChecked || isQuizFinished}
                            style={getInputStyle(currentAnswerChecked, currentResult, styles)}
                        />
                        <Text style={{ fontSize: 'inherit' }}>{questionParts[1]}</Text>
                    </Space>
                </Title>

                <div style={{ minHeight: 80 }}>
                    {currentAnswerChecked && !isQuizFinished && (
                        currentResult === 'correct' ? (
                            <Alert message="Chính xác!" type="success" showIcon />
                        ) : (
                            <Alert
                                message={
                                    <span className='text-xl'>
                                        Chưa đúng. Đáp án đúng là: <Text className='text' strong>{currentQuestion.answer}</Text>
                                    </span>
                                }
                                type="error"
                                showIcon
                            />
                        )
                    )}
                    {isQuizFinished && (
                        currentResult === 'correct' ? (
                            <Alert
                                message={
                                    <span>
                                        Bạn đã trả lời đúng: <Text strong>{currentQuestion.answer}</Text>
                                    </span>
                                }
                                type="success"
                                showIcon
                            />
                        ) : (
                            <Alert
                                message={
                                    <span>
                                        Bạn đã trả lời: <Text strong delete>{answers[currentQuestionIndex]}</Text>.{' '}
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

            <Space style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
                <Button style={{ padding: '20px 30px', }} icon={<LeftOutlined />} onClick={goToPrev} disabled={currentQuestionIndex === 0}>
                    Câu trước
                </Button>

                {!isQuizFinished && (
                    <Button
                        style={{
                            color: '#fff',
                            backgroundColor: '#4F994C',
                            padding: '10px 30px',
                        }}
                        type="primary"
                        size="large"
                        icon={
                            currentAnswerChecked && currentQuestionIndex < totalQuestions - 1 ? (
                                <RightOutlined />
                            ) : null
                        }
                        onClick={handleMainButton}
                    >
                        {!currentAnswerChecked
                            ? 'Kiểm tra'
                            : currentQuestionIndex < totalQuestions - 1
                                ? 'Câu tiếp'
                                : 'Nộp bài'}
                    </Button>
                )}

                {isQuizFinished && (
                    <Button
                        style={{
                            color: '#fff',
                            backgroundColor: '#4F994C',
                            padding: '20px 30px',
                        }}
                        type="primary"
                        icon={<RightOutlined />}
                        onClick={goToNext}
                        disabled={currentQuestionIndex === totalQuestions - 1}
                    >
                        Câu tiếp
                    </Button>
                )}
            </Space>

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
