// src/components/studentPage/Matching/MatchingGame.jsx
import React, { useState } from "react";
import {
    Button,
    Typography,
    Card,
    Progress,
    Row,
    Col,
    Alert,
    Space,
} from "antd";
import CorrectSound from '../../../assets/sound/correct.mp3';
import IncorrectSound from '../../../assets/sound/incorrect.mp3';

const { Title, Text } = Typography;

const selectedStyle = {
    backgroundColor: "#1677ff",
    color: "white",
    borderColor: "#1677ff",
};
const correctStyle = {
    backgroundColor: "#52c41a",
    color: "white",
    borderColor: "#52c41a",
};
const incorrectStyle = {
    backgroundColor: "#f5222d",
    color: "white",
    borderColor: "#f5222d",
};
const mutedStyle = {
    opacity: 0.5,
};

function MatchingGame({ gameData }) {
    const [answers, setAnswers] = useState({});
    const [selectedA, setSelectedA] = useState(null);
    const [disabledPairs, setDisabledPairs] = useState([]); // Lưu các cặp đã làm đúng
    const [feedback, setFeedback] = useState({}); // feedback màu tạm thời

    const pairs = gameData?.pairs || [];
    const totalQuestions = pairs.length;
    const progressPercent = Math.round(
        ((Object.keys(answers).length || 0) / (totalQuestions || 1)) * 100
    );

    const handleSelectA = (index) => {
        if (disabledPairs.includes(index)) return;
        setSelectedA(index);
    };

    const handleSelectB = (index) => {
        if (selectedA === null) return;

        const pairA = pairs[selectedA];
        const pairB = pairs[index];

        const isCorrect = pairA.item_b === pairB.item_b;

        // Hiển thị phản hồi màu
        setFeedback({
            [selectedA]: isCorrect ? "correct" : "incorrect",
            [`b-${index}`]: isCorrect ? "correct" : "incorrect",
        });

        if (isCorrect) {
            const correctAudio = new Audio(CorrectSound);
            correctAudio.play();
            // Sau 1 giây làm mờ và lưu là đã hoàn thành
            setTimeout(() => {
                setDisabledPairs((prev) => [...prev, selectedA]);
                setFeedback({});
                setAnswers((prev) => ({ ...prev, [selectedA]: pairB.item_b }));
                setSelectedA(null);
            }, 1000);
        } else {
            const incorrectAudio = new Audio(IncorrectSound);
            incorrectAudio.play();
            // Nếu sai: sau 1s reset chọn lại
            setTimeout(() => {
                setFeedback({});
                setSelectedA(null);
            }, 1000);
        }
    };

    const resetGame = () => {
        setAnswers({});
        setSelectedA(null);
        setDisabledPairs([]);
        setFeedback({});
    };

    const correctCount = disabledPairs.length;

    return (
        <Card>
            <Progress
                percent={progressPercent}
                format={() => `${correctCount}/${totalQuestions}`}
                style={{ marginBottom: 24 }}
            />

            <Alert
                message={gameData?.instruction || "Nối các cặp tương ứng giữa hai cột"}
                type="info"
                style={{ marginBottom: 24 }}
            />

            <Row gutter={24}>
                {/* Cột A */}
                <Col xs={12}>
                    <Title level={5} style={{ textAlign: "center" }}>
                        Cột A
                    </Title>
                    <Space direction="vertical" style={{ width: "100%" }}>
                        {pairs.map((p, i) => {
                            let style = {};
                            if (disabledPairs.includes(i)) style = mutedStyle;
                            else if (feedback[i] === "correct") style = correctStyle;
                            else if (feedback[i] === "incorrect") style = incorrectStyle;
                            else if (selectedA === i) style = selectedStyle;

                            return (
                                <Card
                                    key={i}
                                    onClick={() => handleSelectA(i)}
                                    style={{
                                        cursor: "pointer",
                                        border: "1px solid #d9d9d9",
                                        transition: "all 0.3s",
                                        ...style,
                                    }}
                                >
                                    <Text strong>{p.item_a}</Text>
                                </Card>
                            );
                        })}
                    </Space>
                </Col>

                {/* Cột B */}
                <Col xs={12}>
                    <Title level={5} style={{ textAlign: "center" }}>
                        Cột B
                    </Title>
                    <Space direction="vertical" style={{ width: "100%" }}>
                        {pairs.map((p, i) => {
                            let style = {};
                            if (Object.values(answers).includes(p.item_b)) style = mutedStyle;
                            else if (feedback[`b-${i}`] === "correct")
                                style = correctStyle;
                            else if (feedback[`b-${i}`] === "incorrect")
                                style = incorrectStyle;

                            return (
                                <Card
                                    key={i}
                                    onClick={() => handleSelectB(i)}
                                    style={{
                                        cursor: "pointer",
                                        border: "1px solid #d9d9d9",
                                        transition: "all 0.3s",
                                        ...style,
                                    }}
                                >
                                    <Text>{p.item_b}</Text>
                                </Card>
                            );
                        })}
                    </Space>
                </Col>
            </Row>

            {/* Nút hành động */}
            <Space
                style={{
                    marginTop: 24,
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                }}
            >
                <Button size="large" onClick={resetGame}>
                    Chơi lại
                </Button>
            </Space>

            {correctCount === totalQuestions && (
                <Alert
                    message={`🎉 Hoàn thành! Bạn đã nối đúng ${correctCount}/${totalQuestions} cặp!`}
                    type="success"
                    style={{ marginTop: 16 }}
                    showIcon
                />
            )}
        </Card>
    );
}

export default MatchingGame;
