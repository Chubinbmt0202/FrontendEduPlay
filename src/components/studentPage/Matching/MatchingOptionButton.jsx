// src/components/studentPage/MatchingGame/MatchingOptionButton.jsx

import React from 'react';
import { Radio } from 'antd';
import { selectedStyle, correctStyle, incorrectStyle, mutedStyle } from './styles';

export default function MatchingOptionButton({
    optionText,
    isUserSelection,
    isCorrectAnswer,
    currentAnswerChecked,
    isQuizFinished,
    result
}) {
    const baseStyle = {
        width: '100%', fontSize: 16, minHeight: '50px',
        height: 'auto', display: 'flex', alignItems: 'center',
        justifyContent: 'center', whiteSpace: 'normal', lineHeight: '1.4'
    };

    const getButtonStyle = () => {
        if (!currentAnswerChecked && !isQuizFinished) {
            if (isUserSelection) return { ...baseStyle, ...selectedStyle };
            return baseStyle;
        }
        if (isCorrectAnswer) return { ...baseStyle, ...correctStyle };
        if (isUserSelection && result === 'incorrect') {
            return { ...baseStyle, ...incorrectStyle };
        }
        return { ...baseStyle, ...mutedStyle };
    };

    return (
        <Radio.Button value={optionText} style={getButtonStyle()}>
            {optionText}
        </Radio.Button>
    );
}
