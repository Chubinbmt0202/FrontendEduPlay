// src/components/studentPage/QuizNavigation.jsx

import React from 'react';
import { Space, Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

function QuizNavigation({
    isFinished,
    isChecked,
    isFirstQuestion,
    isLastQuestion,
    isAnswerSelected,
    onPrev,
    onNext,
    onMainButton
}) {
    return (
        <Space style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
            <Button
                icon={<LeftOutlined />}
                onClick={onPrev}
                disabled={isFirstQuestion}
            >
                Câu trước
            </Button>

            {/* Nút chính (Kiểm tra / Câu tiếp / Nộp bài) */}
            {/* Chỉ hiển thị khi CHƯA nộp bài */}
            {!isFinished && (
                <Button
                    type="primary"
                    size="large"
                    icon={isChecked && !isLastQuestion ? <RightOutlined /> : null}
                    onClick={onMainButton}
                    // Vô hiệu hóa nút "Kiểm tra" nếu user chưa chọn gì
                    disabled={!isChecked && !isAnswerSelected}
                >
                    {!isChecked ? "Kiểm tra" :
                        (!isLastQuestion ? "Câu tiếp" : "Nộp bài")
                    }
                </Button>
            )}

            {/* Nút "Câu tiếp" ở chế độ REVIEW (sau khi đã nộp) */}
            {isFinished && (
                <Button
                    type="primary"
                    icon={<RightOutlined />}
                    onClick={onNext}
                    disabled={isLastQuestion}
                >
                    Câu tiếp
                </Button>
            )}
        </Space>
    );
}

export default QuizNavigation;