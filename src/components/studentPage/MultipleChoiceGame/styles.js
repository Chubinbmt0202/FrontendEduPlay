// src/components/studentPage/styles.js

// Style cho nút đang được CHỌN (TRƯỚC khi "Kiểm tra")
export const selectedStyle = {
    backgroundColor: '#1677ff !important', // Xanh dương
    color: 'white !important',
    borderColor: '#1677ff !important',
    opacity: 1,
};

// Style cho nút ĐÚNG (SAU khi "Kiểm tra")
export const correctStyle = {
    backgroundColor: '#52c41a !important', // Xanh lá
    color: 'white !important',
    borderColor: '#52c41a !important',
    opacity: 1,
};

// Style cho nút SAI (SAU khi "Kiểm tra")
export const incorrectStyle = {
    backgroundColor: '#f5222d !important', // Đỏ
    color: 'white !important',
    borderColor: '#f5222d !important',
    opacity: 1,
};

// Style cho nút bị mờ đi (SAU khi "Kiểm tra")
export const mutedStyle = {
    opacity: 0.6,
    // (Muted style không cần !important vì nó không bị xung đột)
};