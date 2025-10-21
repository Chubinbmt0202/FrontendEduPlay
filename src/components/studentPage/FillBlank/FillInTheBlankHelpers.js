// src/components/studentPage/FillInTheBlankGame/FillInTheBlankHelpers.js
import CorrectSound from '../../../assets/sound/correct.mp3';
import IncorrectSound from '../../../assets/sound/incorrect.mp3';
// Kiểm tra đáp án (không phân biệt hoa thường, loại bỏ khoảng trắng)
export const checkAnswer = (userAnswer, correctAnswer) => {
    if (!userAnswer) return false;
    return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
};

// Xác định style viền input dựa trên kết quả hiện tại
export const getInputStyle = (isChecked, currentResult, styles) => {
    if (!isChecked) return { ...styles.inputBaseStyle, ...styles.normalBorder };
    if (currentResult === 'correct') {
        const audio = new Audio(CorrectSound);
        audio.play();
        return { ...styles.inputBaseStyle, ...styles.correctBorder };
    }
    const audio = new Audio(IncorrectSound);
    audio.play();
    return { ...styles.inputBaseStyle, ...styles.incorrectBorder };
};
