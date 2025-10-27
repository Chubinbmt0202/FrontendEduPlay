// src/components/studentPage/MultipleChoiceGame.jsx

import React, { useState, useEffect } from 'react';
import { Alert, Card, Progress } from 'antd';
import QuizQuestion from './QuizQuestion';
import QuizNavigation from './QuizNavigation';
import './MultipleChoiceGame.css';

function MultipleChoiceGame({ gameData }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { 0: 1, 1: 3, ... }
    const [results, setResults] = useState({}); // { 0: 'correct', 1: 'incorrect', ... }
    const [currentAnswerChecked, setCurrentAnswerChecked] = useState(false);
    const [isQuizFinished, setIsQuizFinished] = useState(false);

    const totalQuestions = gameData.questions.length;
    const currentQuestion = gameData.questions[currentQuestionIndex];

    useEffect(() => {
        setCurrentQuestionIndex(0);
        setAnswers({});
        setResults({});
        setCurrentAnswerChecked(false);
        setIsQuizFinished(false);
    }, [gameData]);

    // --- CÁC HÀM LOGIC VẪN GIỮ NGUYÊN ---

    const handleAnswerChange = (answerIndex) => {
        if (currentAnswerChecked || isQuizFinished) return;
        setAnswers({ ...answers, [currentQuestionIndex]: answerIndex });

        if (results[currentQuestionIndex] === 'incorrect') {
            const newResults = { ...results };
            delete newResults[currentQuestionIndex];
            setResults(newResults);
        }
    };

    const handleMainButton = () => {
        if (!currentAnswerChecked) {
            if (answers[currentQuestionIndex] === undefined) return;
            const isCorrect = answers[currentQuestionIndex] === currentQuestion.correct_answer_index;

            if (isCorrect) {
                setResults(prev => ({ ...prev, [currentQuestionIndex]: 'correct' }));
                setCurrentAnswerChecked(true); // Khóa lại
            } else {
                setResults(prev => ({ ...prev, [currentQuestionIndex]: 'incorrect' }));
                // Không khóa, cho chọn lại
            }
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

    // --- TÍNH TOÁN CÁC GIÁ TRỊ ---
    const correctCount = Object.values(results).filter(r => r === 'correct').length;
    const questionsAnswered = Object.keys(results).length;
    const progressPercent = Math.round(
        (isQuizFinished ? 1 : (questionsAnswered / totalQuestions)) * 100
    );

    // Tính toán các boolean để truyền xuống component con
    const isFirstQuestion = currentQuestionIndex === 0;
    const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
    const isAnswerSelected = answers[currentQuestionIndex] !== undefined;

    return (
        <Card className="multiple-choice-game-card">
            {/* 1. Thanh Tiến Trình */}
            <Progress
                percent={progressPercent}
                format={() => isQuizFinished ?
                    `Đã hoàn thành ${correctCount}/${totalQuestions}` :
                    `Đã trả lời ${questionsAnswered}/${totalQuestions}`
                }
                style={{ marginBottom: 24 }}
            />

            {/* 2. Nội Dung Câu Hỏi (Đã tách) */}
            <QuizQuestion
                question={currentQuestion}
                questionIndex={currentQuestionIndex}
                userAnswer={answers[currentQuestionIndex]}
                result={results[currentQuestionIndex]}
                isFinished={isQuizFinished}
                isChecked={currentAnswerChecked}
                onAnswerChange={handleAnswerChange}
            />

            {/* 3. Thanh Điều Hướng (Đã tách) */}
            <QuizNavigation
                isFinished={isQuizFinished}
                isChecked={currentAnswerChecked}
                isFirstQuestion={isFirstQuestion}
                isLastQuestion={isLastQuestion}
                isAnswerSelected={isAnswerSelected}
                onPrev={goToPrev}
                onNext={goToNext}
                onMainButton={handleMainButton}
            />

            {/* 4. Thông báo kết quả */}
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