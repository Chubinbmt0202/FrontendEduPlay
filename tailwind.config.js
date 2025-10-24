/* eslint-env node */
/** @type {import('tailwindcss').Config} */
export const content = [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}", // Đảm bảo khớp với phần mở rộng tệp của bạn
];
export const theme = {
    extend: {
        fontFamily: {
            // Thêm Poppins vào danh sách font-family
            // 'sans' là font mặc định của Tailwind cho các chữ không có chân
            // Bạn có thể đặt tên khác nếu muốn, ví dụ: 'poppins'
            sans: ['Roboto', 'sans-serif'],
        },
    },
};
export const plugins = [];