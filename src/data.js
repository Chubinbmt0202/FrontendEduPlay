// src/data.js

export const jsonData = {
    lesson_title: 'TOÁN (Tiết 22) Bài 8: BẢNG CỘNG (QUA 10) Tiết 2 – Luyện tập',
    generated_games: [
        {
            game_type: 'multiple_choice_abcd',
            questions: [
                {
                    question_text: 'Phép cộng nào dưới đây có tổng là 12?',
                    options: ['6 + 5', '7 + 4', '8 + 4', '9 + 2'],
                    correct_answer_index: 2,
                },
                {
                    question_text: 'Kết quả của phép tính 9 + 8 là bao nhiêu?',
                    options: ['16', '17', '18', '15'],
                    correct_answer_index: 1,
                },
                {
                    question_text:
                        'Khi thực hiện phép cộng 7 + 5, số 7 và số 5 được gọi là gì?',
                    options: ['Tổng', 'Hiệu', 'Số hạng', 'Tích'],
                    correct_answer_index: 2,
                },
            ],
        },
        {
            game_type: 'true_false',
            statements: [
                {
                    statement_text: 'Phép tính 6 + 6 có kết quả lớn hơn 11.',
                    is_true: true,
                },
                {
                    statement_text: 'Kết quả của 9 + 2 và 7 + 7 là bằng nhau.',
                    is_true: false,
                },
                {
                    statement_text:
                        "Trong bài toán '7 người trong ca-bin thứ nhất và 8 người trong ca-bin thứ hai', để tìm tổng số người, ta thực hiện phép tính 7 + 8.",
                    is_true: true,
                },
            ],
        },
        {
            game_type: 'fill_in_the_blank',
            sentences: [
                {
                    sentence_with_blank: 'Hoàn thành phép tính: 7 + 5 = ___.',
                    answer: '12',
                },
                {
                    sentence_with_blank:
                        'Trong phép cộng, các số được cộng vào nhau được gọi là ___.',
                    answer: 'số hạng',
                },
                {
                    sentence_with_blank: 'Phép tính 9 + 3 có tổng là ___.',
                    answer: '12',
                },
            ],
        },
        {
            game_type: 'matching',
            instruction: 'Hãy nối mỗi phép tính với kết quả đúng của nó.',
            pairs: [
                { item_a: '8 + 7', item_b: '15' },
                { item_a: '9 + 4', item_b: '13' },
                { item_a: '6 + 8', item_b: '14' },
            ],
        },
        {
            game_type: 'flashcards',
            deck_title: 'Bảng cộng qua 10',
            cards: [
                { front: 'Số hạng', back: 'Là các số cộng với nhau trong phép cộng.' },
                { front: 'Tổng', back: 'Là kết quả của phép cộng.' },
                { front: '9 + 8', back: '17' },
            ],
        },
        {
            game_type: 'sorting',
            instruction: 'Kéo thả các phép tính vào đúng nhóm tổng của chúng.',
            categories: [
                {
                    category_name: 'Tổng bằng 12',
                    items: ['7 + 5', '9 + 3', '8 + 4', '6 + 6'],
                },
                {
                    category_name: 'Tổng bằng 13',
                    items: ['9 + 4', '6 + 7'],
                },
                {
                    category_name: 'Tổng bằng 14',
                    items: ['8 + 6', '7 + 7'],
                },
            ],
        },
    ],
};