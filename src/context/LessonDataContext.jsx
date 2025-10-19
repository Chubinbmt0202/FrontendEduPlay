// src/context/LessonDataContext.jsx
import React, { createContext, useState, useContext } from 'react';
import { jsonData } from '../data'; // Dữ liệu mặc định

// 1. Tạo Context
const LessonDataContext = createContext();

// 2. Tạo Provider Component (bọc ngoài ứng dụng)
export function LessonDataProvider({ children }) {
    const [lessonData, setLessonData] = useState(jsonData); // State tổng nằm ở đây

    // Hàm để cập nhật state từ bất kỳ đâu
    const updateLessonData = (newData) => {
        if (newData && newData.generated_games) {
            setLessonData(newData);
            return true; // Báo thành công
        }
        console.error("Dữ liệu cập nhật không hợp lệ:", newData);
        return false; // Báo thất bại
    };

    return (
        <LessonDataContext.Provider value={{ lessonData, updateLessonData }}>
            {children}
        </LessonDataContext.Provider>
    );
}

// 3. Tạo Custom Hook để dễ sử dụng
// eslint-disable-next-line react-refresh/only-export-components
export function useLessonData() {
    const context = useContext(LessonDataContext);
    if (context === undefined) {
        throw new Error('useLessonData must be used within a LessonDataProvider');
    }
    return context;
}