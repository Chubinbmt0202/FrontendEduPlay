/* eslint-disable react-hooks/exhaustive-deps */
// src/components/GameEditForm.jsx
import React, { useEffect, useMemo } from 'react'; // Thêm useMemo để tối ưu (tùy chọn)
import { Form, Input, Button, Space, Radio, Checkbox, Alert } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { getDefaultValues } from '../utils/gameDefault'; // 1. IMPORT HÀM MẶC ĐỊNH TỪ FILE RIÊNG

// 2. IMPORT CÁC COMPONENT FORM CON (ví dụ: cho Multiple Choice)
import MultipleChoiceForm from './gameForms/MultipleChoiceForm';
import MatchingForm from './gameForms/MatchingForm';
// import TrueFalseForm from './gameForms/TrueFalseForm';
// ... import các form khác

// Component chính GameEditForm nhận các props:
// gameType: Loại game/câu hỏi hiện tại (ví dụ: 'multiple_choice_abcd')
// initialData: Dữ liệu hiện có của câu hỏi (dùng cho chế độ chỉnh sửa)
// onSave: Callback khi form được submit thành công
// onCancel: Callback khi người dùng hủy bỏ
function GameEditForm({ gameType, initialData, onSave, onCancel, onChange }) {
    const [form] = Form.useForm(); // Sử dụng hook useForm của Ant Design

    // Xử lý logic chuẩn hóa dữ liệu và set giá trị ban đầu cho form
    useEffect(() => {
        if (initialData) {
            // 3. CHẾ ĐỘ CHỈNH SỬA
            const clone = JSON.parse(JSON.stringify(initialData)); // Clone dữ liệu để tránh thay đổi trực tiếp props

            // ** CHUẨN HÓA DỮ LIỆU CỤ THỂ CHO TỪNG LOẠI GAME **

            if (gameType === 'multiple_choice_abcd') {
                // Đảm bảo 'options' là mảng và có ít nhất 4 phần tử mặc định nếu rỗng
                clone.options = Array.isArray(clone.options) && clone.options.length > 0 ? clone.options : ['', '', '', ''];

                // Đảm bảo 'correct_answer_index' là số hợp lệ
                clone.correct_answer_index = Number.isFinite(clone.correct_answer_index)
                    ? Number(clone.correct_answer_index)
                    : 0;
                // Giới hạn chỉ mục trong phạm vi mảng options
                if (clone.correct_answer_index < 0) clone.correct_answer_index = 0;
                if (clone.correct_answer_index >= clone.options.length) clone.correct_answer_index = clone.options.length - 1;
            }

            // (Logic chuẩn hóa tương tự cho 'matching', 'flashcards', 'sorting'...)
            if (gameType === 'matching') {

                console.log('Initial matching data before normalization:', clone);

                // ✨ 1. TRÍCH XUẤT VÀ CHUẨN HÓA CÁC CẶP (Lưu ý: Dữ liệu bị flat)

                let existingPairs = Array.isArray(clone.pairs) ? clone.pairs : [];

                // Nếu đối tượng clone hiện tại là một cặp đơn (như log bạn thấy), hãy thêm nó vào mảng.
                // Điều này xử lý trường hợp dữ liệu cũ bị "làm phẳng" sai.
                if (clone.item_a || clone.item_b) {
                    existingPairs = [{ item_a: clone.item_a || '', item_b: clone.item_b || '' }, ...existingPairs];

                    // Quan trọng: Xóa các thuộc tính cũ khỏi cấp độ gốc sau khi trích xuất
                    delete clone.item_a;
                    delete clone.item_b;
                }

                // 2. CHUẨN HÓA CUỐI CÙNG VÀ GÁN VÀO FORM
                clone.pairs = existingPairs.length > 0
                    ? existingPairs.map(p => ({ item_a: p?.item_a || '', item_b: p?.item_b || '' }))
                    : [{ item_a: '', item_b: '' }]; // Giá trị mặc định nếu rỗng

                // 3. Đảm bảo instruction là string
                clone.instruction = clone.instruction || '';

                // Bây giờ, đối tượng clone đã có cấu trúc đúng: { pairs: [...], instruction: '...' }
                console.log('Initial matching data AFTER normalization:', clone);
            }

            if (gameType === 'flashcards') {
                clone.cards = Array.isArray(clone.cards) && clone.cards.length > 0 ? clone.cards : [{ front: '', back: '' }];
            }

            if (gameType === 'sorting') {
                clone.categories = Array.isArray(clone.categories) && clone.categories.length > 0
                    // Lặp qua các category để chuẩn hóa items bên trong
                    ? clone.categories.map(cat => ({
                        category_name: cat.category_name || '',
                        items: Array.isArray(cat.items) && cat.items.length ? cat.items : ['']
                    }))
                    : [{ category_name: '', items: [''] }]; // Mặc định nếu không có category
            }

            form.setFieldsValue(clone); // Set giá trị đã chuẩn hóa vào form
        } else {
            // 4. CHẾ ĐỘ TẠO MỚI: Dùng giá trị mặc định
            form.setFieldsValue(getDefaultValues(gameType));
        }
    }, [initialData, gameType, form]); // Dependencies: Chạy lại khi data hoặc gameType thay đổi

    // Xử lý khi form submit thành công
    const onFinish = (values) => {
        const cloned = JSON.parse(JSON.stringify(values)); // Clone giá trị đã submit
        console.log('Form submitted with values:', cloned); // Debug: In ra console giá trị form

        // ** CHUẨN HÓA DỮ LIỆU TRƯỚC KHI GỬI (dọn dẹp) **

        if (gameType === 'multiple_choice_abcd') {
            // Đảm bảo options là mảng string và chuẩn hóa index
            cloned.options = Array.isArray(cloned.options) ? cloned.options.map(o => (o == null ? '' : o)) : ['', ''];
            cloned.correct_answer_index = Number(cloned.correct_answer_index || 0);

            // Giới hạn index lần nữa (phòng trường hợp xóa option)
            if (cloned.correct_answer_index < 0) cloned.correct_answer_index = 0;
            if (cloned.correct_answer_index >= cloned.options.length) cloned.correct_answer_index = cloned.options.length - 1;
        }

        if (gameType === 'matching') {
            // Lọc ra các cặp có item_a hoặc item_b bị trống
            cloned.pairs = Array.isArray(cloned.pairs)
                ? cloned.pairs
                    .map(p => ({ item_a: p?.item_a || '', item_b: p?.item_b || '' }))
                    // Chỉ giữ lại các cặp có ít nhất một trường được điền
                    .filter(p => p.item_a || p.item_b)
                : [];

            // Đảm bảo instruction là string
            cloned.instruction = cloned.instruction || '';
        }

        if (gameType === 'flashcards') {
            // Đảm bảo cards là mảng đối tượng {front, back}
            cloned.cards = Array.isArray(cloned.cards) ? cloned.cards.map(c => ({ front: c?.front || '', back: c?.back || '' })) : [];
        }

        if (gameType === 'sorting') {
            // Đảm bảo categories là mảng và item bên trong cũng được chuẩn hóa
            cloned.categories = Array.isArray(cloned.categories)
                ? cloned.categories.map(cat => ({
                    category_name: cat.category_name || '',
                    items: Array.isArray(cat.items) ? cat.items.map(it => (it == null ? '' : it)) : [],
                }))
                : [];
        }

        onSave(cloned); // Gọi callback onSave với dữ liệu đã chuẩn hóa
    };

    // Hàm render các trường form tùy thuộc vào loại game
    const renderFormFields = useMemo(() => { // Dùng useMemo để tránh tạo lại hàm không cần thiết
        switch (gameType) {
            // 5. LOẠI TRẮC NGHIỆM: Sử dụng component form con
            case 'multiple_choice_abcd':
                return <MultipleChoiceForm form={form} />;

            // 6. LOẠI ĐÚNG/SAI
            case 'true_false':
                return (
                    <>
                        <Form.Item
                            name="statement_text"
                            label="Mệnh đề"
                            rules={[{ required: true, message: 'Vui lòng nhập mệnh đề' }]}
                        >
                            <Input.TextArea rows={3} />
                        </Form.Item>
                        {/* Checkbox dùng valuePropName="checked" để lấy giá trị boolean */}
                        <Form.Item name="is_true" label="Giá trị" valuePropName="checked">
                            <Checkbox>Là ĐÚNG</Checkbox>
                        </Form.Item>
                    </>
                );

            // 7. LOẠI ĐIỀN VÀO CHỖ TRỐNG
            case 'fill_in_the_blank':
                return (
                    <>
                        <Form.Item
                            name="sentence_with_blank"
                            label="Câu (dùng ___ cho chỗ trống)" // Hướng dẫn người dùng
                            rules={[{ required: true, message: 'Vui lòng nhập câu' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="answer"
                            label="Đáp án"
                            rules={[{ required: true, message: 'Vui lòng nhập đáp án' }]}
                        >
                            <Input />
                        </Form.Item>
                    </>
                );

            // 8. LOẠI NỐI CẶP (MATCHING): Sử dụng Form.List lồng nhau để quản lý các cặp
            case 'matching':
                // (Phần này được giữ lại trong file chính để minh họa cách tổ chức ban đầu, 
                // nhưng **nên** được tách ra thành MatchingForm.jsx như ví dụ 2)
                return <MatchingForm form={form} />;

            // 9. CÁC LOẠI KHÁC (Flashcards, Sorting,...)
            // ... (cũng nên được tách thành component con)

            // Trường hợp không có form hỗ trợ
            default:
                return <Alert message="Loại game này chưa hỗ trợ chỉnh sửa." type="warning" />;
        }
    }, [gameType]); // Chỉ tính toán lại khi gameType thay đổi

    // Giao diện chính của GameEditForm

    const handleValueChange = (changedValues, allValues) => {
        console.log('Giá trị đã thay đổi:', changedValues);
        console.log('Tất cả giá trị hiện tại:', allValues);

        // 🚀 Tùy chọn: Gọi một callback prop nếu component cha muốn biết ngay lập tức
        if (onChange) {
            // Có thể truyền ChangedValues hoặc AllValues tùy theo nhu cầu
            onChange(allValues, changedValues);
        }

        // Ví dụ: Kích hoạt nút Lưu nếu form đã bị thay đổi (dùng state để quản lý)
        // setIsDirty(true);
    };
    return (
        <Form
            form={form} // Kết nối form instance
            layout="vertical" // Bố cục form theo chiều dọc
            onFinish={onFinish} // Xử lý submit
            onValuesChange={handleValueChange}
        >
            {/* Render các trường form tương ứng với loại game */}
            {renderFormFields}

            {/* Khối nút hành động (Hủy, Lưu) */}
            <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                <Space>
                    <Button onClick={onCancel}>Hủy</Button>
                    <Button type="primary" htmlType="submit">
                        Lưu
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
}

export default GameEditForm;