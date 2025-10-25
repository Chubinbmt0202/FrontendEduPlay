/* eslint-disable react-hooks/exhaustive-deps */
// src/components/studentPage/Matching/MatchingGame.jsx
import React, { useState, useMemo } from "react"; // Thêm useMemo
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

// --- BỔ SUNG: Hàm xáo trộn mảng (Fisher-Yates shuffle) ---
const shuffleArray = (array) => {
    let currentIndex = array.length,
        randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }

    return array;
};
// --- KẾT THÚC BỔ SUNG ---

function MatchingGame({ gameData }) {
    const [answers, setAnswers] = useState({});
    const [selectedA, setSelectedA] = useState(null);
    const [disabledPairs, setDisabledPairs] = useState([]); // Lưu các cặp đã làm đúng (theo chỉ mục gốc)
    const [feedback, setFeedback] = useState({}); // feedback màu tạm thời (theo chỉ mục gốc)

    // const pairs = gameData?.pairs || [];
    // Bắt đầu logic chuẩn hóa (Flattening)
    const rawData = useMemo(() => {
        // Nếu gameData là mảng (dạng dữ liệu cũ bị flat)
        if (Array.isArray(gameData)) {
            return { pairs: gameData, instruction: "Nối các cặp tương ứng" };
        }
        // Nếu gameData là object (dạng chuẩn mới)
        return gameData;
    }, [gameData]);


    const pairs = useMemo(() => {
        let rawPairs = Array.isArray(rawData?.pairs) ? rawData.pairs : [];
        let finalPairs = [];

        // Xử lý mảng rawPairs (có thể chứa các đối tượng bài tập bị nhúng nhầm)
        rawPairs.forEach(item => {
            // Trường hợp 1: Đối tượng là một bài tập khác bị nhúng (có thuộc tính 'pairs' là mảng)
            if (item && Array.isArray(item.pairs)) {
                // Nâng các cặp con lên (Flatten)
                finalPairs.push(...item.pairs);
            }
            // Trường hợp 2: Đối tượng là một cặp hợp lệ (có item_a hoặc item_b)
            else if (item && (item.item_a || item.item_b)) {
                finalPairs.push(item);
            }
        });

        // Chuẩn hóa cuối cùng: Đảm bảo item_a/item_b là string và lọc cặp rỗng
        return finalPairs
            .map(p => ({ item_a: p?.item_a || '', item_b: p?.item_b || '' }))
            .filter(p => p.item_a || p.item_b); // Lọc bỏ cặp rỗng hoàn toàn

    }, [rawData]);
    const totalQuestions = pairs.length;
    const progressPercent = Math.round(
        ((Object.keys(answers).length || 0) / (totalQuestions || 1)) * 100
    );

    // --- THAY ĐỔI: Tạo danh sách xáo trộn cho cột A và B ---
    const shuffledA = useMemo(() => {
        if (!pairs || pairs.length === 0) return [];
        const listA = pairs.map((p, index) => ({
            text: p.item_a,
            originalIndex: index, // Lưu chỉ mục gốc
        }));
        return shuffleArray(listA);
    }, [pairs]); // Chỉ xáo trộn lại khi 'pairs' thay đổi

    const shuffledB = useMemo(() => {
        if (!pairs || pairs.length === 0) return [];
        const listB = pairs.map((p, index) => ({
            text: p.item_b,
            originalIndex: index, // Lưu chỉ mục gốc
        }));
        return shuffleArray(listB);
    }, [pairs]); // Chỉ xáo trộn lại khi 'pairs' thay đổi
    // --- KẾT THÚC THAY ĐỔI ---

    // handleSelectA giờ nhận originalIndex
    const handleSelectA = (originalIndex) => {
        if (disabledPairs.includes(originalIndex)) return;
        setSelectedA(originalIndex);
    };

    // handleSelectB giờ nhận originalIndex
    const handleSelectB = (originalIndex) => {
        if (selectedA === null) return;

        // So sánh dựa trên chỉ mục gốc
        const pairA = pairs[selectedA];
        const pairB = pairs[originalIndex];

        const isCorrect = pairA.item_b === pairB.item_b;

        // Phản hồi dựa trên chỉ mục gốc
        setFeedback({
            [selectedA]: isCorrect ? "correct" : "incorrect",
            [`b-${originalIndex}`]: isCorrect ? "correct" : "incorrect",
        });

        if (isCorrect) {
            const correctAudio = new Audio(CorrectSound);
            correctAudio.play();
            setTimeout(() => {
                setDisabledPairs((prev) => [...prev, selectedA]);
                setFeedback({});
                setAnswers((prev) => ({ ...prev, [selectedA]: pairB.item_b }));
                setSelectedA(null);
            }, 1000);
        } else {
            const incorrectAudio = new Audio(IncorrectSound);
            incorrectAudio.play();
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
        // Lưu ý: Việc reset này không xáo trộn lại, 
        // người dùng sẽ chơi lại với đúng thứ tự đã xáo trộn trước đó.
        // Đây thường là hành vi mong muốn.
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
                        {/* --- THAY ĐỔI: Render từ shuffledA --- */}
                        {shuffledA.map((item) => {
                            const i = item.originalIndex; // Lấy chỉ mục gốc
                            let style = {};
                            if (disabledPairs.includes(i)) style = mutedStyle;
                            else if (feedback[i] === "correct") style = correctStyle;
                            else if (feedback[i] === "incorrect") style = incorrectStyle;
                            else if (selectedA === i) style = selectedStyle;

                            return (
                                <Card
                                    key={`a-${i}`} // Key nên là duy nhất
                                    onClick={() => handleSelectA(i)} // Gửi chỉ mục gốc
                                    style={{
                                        cursor: "pointer",
                                        border: "1px solid #d9d9d9",
                                        transition: "all 0.3s",
                                        ...style,
                                    }}
                                >
                                    <Text strong>{item.text}</Text> {/* Hiển thị text đã xáo trộn */}
                                </Card>
                            );
                        })}
                        {/* --- KẾT THÚC THAY ĐỔI --- */}
                    </Space>
                </Col>

                {/* Cột B */}
                <Col xs={12}>
                    <Title level={5} style={{ textAlign: "center" }}>
                        Cột B
                    </Title>
                    <Space direction="vertical" style={{ width: "100%" }}>
                        {/* --- THAY ĐỔI: Render từ shuffledB --- */}
                        {shuffledB.map((item) => {
                            const i = item.originalIndex; // Lấy chỉ mục gốc
                            const itemBValue = pairs[i].item_b; // Lấy giá trị B gốc để so sánh

                            let style = {};
                            // Kiểm tra xem giá trị B này đã được nối chưa
                            if (Object.values(answers).includes(itemBValue)) style = mutedStyle;
                            else if (feedback[`b-${i}`] === "correct")
                                style = correctStyle;
                            else if (feedback[`b-${i}`] === "incorrect")
                                style = incorrectStyle;

                            return (
                                <Card
                                    key={`b-${i}`} // Key nên là duy nhất
                                    onClick={() => handleSelectB(i)} // Gửi chỉ mục gốc
                                    style={{
                                        cursor: "pointer",
                                        border: "1px solid #d9d9d9",
                                        transition: "all 0.3s",
                                        ...style,
                                    }}
                                >
                                    <Text>{item.text}</Text> {/* Hiển thị text đã xáo trộn */}
                                </Card>
                            );
                        })}
                        {/* --- KẾT THÚC THAY ĐỔI --- */}
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