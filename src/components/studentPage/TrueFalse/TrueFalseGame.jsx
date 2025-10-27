// src/components/studentPage/TrueFalseGame/TrueFalseGame.jsx

import React, { useState, useEffect } from 'react';
import { Radio, Space, Button, Typography, Alert, Card, Progress, Row, Col, message } from 'antd';
import { CheckCircleFilled, CloseCircleFilled, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { getButtonStyle } from './TrueFalseHelpers';
import './TrueFalseGame.css';

const { Title } = Typography;

function TrueFalseGame({ gameData }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [results, setResults] = useState({});
    const [currentAnswerChecked, setCurrentAnswerChecked] = useState(false);
    const [isQuizFinished, setIsQuizFinished] = useState(false);

    const totalQuestions = gameData.statements.length;
    const currentQuestion = gameData.statements[currentQuestionIndex];

    useEffect(() => {
        setCurrentQuestionIndex(0);
        setAnswers({});
        setResults({});
        setCurrentAnswerChecked(false);
        setIsQuizFinished(false);
    }, [gameData]);

    const handleAnswerChange = (answerValue) => {
        if (currentAnswerChecked || isQuizFinished) return;
        setAnswers({
            ...answers,
            [currentQuestionIndex]: answerValue,
        });
    };

    const handleMainButton = () => {
        if (!currentAnswerChecked) {
            if (answers[currentQuestionIndex] === undefined) {
                message.warning('Vui lòng chọn "Đúng" hoặc "Sai"!');
                return;
            }
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
        if (currentQuestionIndex < totalQuestions - 1) setCurrentQuestionIndex(currentQuestionIndex + 1);
    };
    const goToPrev = () => {
        if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1);
    };

    const correctCount = Object.values(results).filter(r => r === 'correct').length;
    const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

    return (
        <Card className='true-false-game-card'>
            <Progress
                percent={progressPercent}
                format={() => isQuizFinished ? `Đã hoàn thành` : `Câu ${currentQuestionIndex + 1} / ${totalQuestions}`}
                style={{ marginBottom: 24 }}
            />

            <div style={{ width: '100%' }}>
                <Title className='titleName' style={{ minHeight: 60, marginBottom: 24, color: '#5f5f5fff' }}>
                    <Space>
                        {isQuizFinished && (
                            results[currentQuestionIndex] === 'correct'
                                ? <CheckCircleFilled style={{ color: 'green' }} />
                                : <CloseCircleFilled style={{ color: 'red' }} />
                        )}
                        {currentQuestion.statement_text}
                    </Space>
                </Title>

                <Radio.Group
                    value={answers[currentQuestionIndex]}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    style={{ width: '100%', fontWeight: 500, fontSize: 25 }}
                    disabled={currentAnswerChecked || isQuizFinished}
                >
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Radio.Button
                                value={true}
                                style={getButtonStyle({
                                    optionValue: true,
                                    answers,
                                    currentQuestionIndex,
                                    currentQuestion,
                                    currentAnswerChecked,
                                    isQuizFinished,
                                    results
                                })}
                            >
                                Đúng
                            </Radio.Button>
                        </Col>
                        <Col span={12}>
                            <Radio.Button
                                value={false}
                                style={getButtonStyle({
                                    optionValue: false,
                                    answers,
                                    currentQuestionIndex,
                                    currentQuestion,
                                    currentAnswerChecked,
                                    isQuizFinished,
                                    results
                                })}
                            >
                                Sai
                            </Radio.Button>
                        </Col>
                    </Row>
                </Radio.Group>
            </div>

            <Space style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
                <Button icon={<LeftOutlined />} onClick={goToPrev} disabled={currentQuestionIndex === 0}>
                    Câu trước
                </Button>

                {!isQuizFinished && (
                    <Button
                        style={{
                            color: '#fff',
                            backgroundColor: '#4F994C'
                        }}
                        type="primary"
                        size="large"
                        icon={currentAnswerChecked && currentQuestionIndex < totalQuestions - 1 ? <RightOutlined /> : null}
                        onClick={handleMainButton}
                    >
                        {!currentAnswerChecked ? "Kiểm tra" :
                            (currentQuestionIndex < totalQuestions - 1 ? "Câu tiếp" : "Nộp bài")}
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
