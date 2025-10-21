// src/components/studentPage/TrueFalseGame/TrueFalseHelpers.js

import { selectedStyle, correctStyle, incorrectStyle, mutedStyle } from './TrueFalseStyles';
import CorrectSound from '../../../assets/sound/correct.mp3';
import IncorrectSound from '../../../assets/sound/incorrect.mp3';
// Hàm lấy style động cho mỗi nút Đúng/Sai
export const getButtonStyle = ({
    optionValue,
    answers,
    currentQuestionIndex,
    currentQuestion,
    currentAnswerChecked,
    isQuizFinished,
    results
}) => {
    const baseStyle = {
        width: '100%', fontSize: 16, minHeight: '70px',
        height: 'auto', display: 'flex', alignItems: 'center',
        justifyContent: 'center', whiteSpace: 'normal', lineHeight: '1.4'
    };

    const isUserSelection = (optionValue === answers[currentQuestionIndex]);
    const isCorrectAnswer = (optionValue === currentQuestion.is_true);

    // Trạng thái 1: Chưa kiểm tra
    if (!currentAnswerChecked && !isQuizFinished) {
        if (isUserSelection) return { ...baseStyle, ...selectedStyle };
        return baseStyle;
    }

    // Trạng thái 2: Đã kiểm tra
    if (isCorrectAnswer) {
        const audio = new Audio(CorrectSound);
        audio.play();
        return { ...baseStyle, ...correctStyle };
    }
    if (isUserSelection && results[currentQuestionIndex] === 'incorrect') {
        const audio = new Audio(IncorrectSound);
        audio.play();
        return { ...baseStyle, ...incorrectStyle };
    }
    return { ...baseStyle, ...mutedStyle };
};
