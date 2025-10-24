// src/utils/gameDefaults.js

// Hàm này trả về cấu trúc dữ liệu mặc định (initial values)
// cho từng loại game/câu hỏi khi người dùng tạo mới.
export const getDefaultValues = (gameType) => {
    switch (gameType) {
        // Cấu trúc mặc định cho câu hỏi trắc nghiệm A-B-C-D
        case 'multiple_choice_abcd':
            return {
                question_text: '', // Nội dung câu hỏi
                options: ['', '', '', ''], // Mảng 4 lựa chọn mặc định
                correct_answer_index: 0, // Chỉ mục đáp án đúng mặc định (ví dụ: lựa chọn đầu tiên)
            };
        // Cấu trúc mặc định cho câu hỏi Đúng/Sai
        case 'true_false':
            return {
                statement_text: '', // Nội dung mệnh đề
                is_true: true, // Giá trị mặc định là ĐÚNG
            };
        // Cấu trúc mặc định cho câu hỏi điền vào chỗ trống
        case 'fill_in_the_blank':
            return {
                sentence_with_blank: '', // Câu có chỗ trống (dùng ký tự đánh dấu, ví dụ: '___')
                answer: '', // Đáp án cần điền
            };
        // Cấu trúc mặc định cho game nối cặp (Matching)
        case 'matching':
            return {
                instruction: '', // Hướng dẫn của game
                pairs: [{ item_a: '', item_b: '' }], // Mảng các cặp nối, mặc định 1 cặp trống
            };
        // Cấu trúc mặc định cho Thẻ ghi nhớ (Flashcards)
        case 'flashcards':
            return {
                deck_title: '', // Tiêu đề của bộ thẻ
                cards: [{ front: '', back: '' }], // Mảng các thẻ, mặc định 1 thẻ trống
            };
        // Cấu trúc mặc định cho game Sắp xếp (Sorting)
        case 'sorting':
            return {
                instruction: '', // Hướng dẫn của game
                categories: [{ category_name: '', items: [''] }], // Mảng các danh mục, mặc định 1 danh mục có 1 item trống
            };
        // Trường hợp loại game không xác định
        default:
            return {};
    }
};