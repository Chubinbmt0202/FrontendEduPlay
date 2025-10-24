// src/components/gameForms/MultipleChoiceForm.jsx
import React from 'react';
import { Form, Input, Button, Radio } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

// Component con chịu trách nhiệm render các trường form cho loại trắc nghiệm
function MultipleChoiceForm({ form }) {
    return (
        <>
            {/* Trường nhập nội dung câu hỏi */}
            <Form.Item
                name="question_text"
                label="Câu hỏi"
                rules={[{ required: true, message: 'Vui lòng nhập câu hỏi' }]}
            >
                <Input.TextArea rows={3} />
            </Form.Item>

            {/* Form.List để quản lý mảng các lựa chọn (options) */}
            <Form.List name="options">
                {(fields, { add, remove }) => (
                    <>
                        {/* Lặp qua từng lựa chọn */}
                        {fields.map((field, index) => (
                            <Form.Item
                                label={`Lựa chọn ${index + 1}`} // Nhãn hiển thị cho người dùng
                                key={field.key}
                                required
                            >
                                {/* Input cho nội dung lựa chọn */}
                                <Form.Item
                                    {...field}
                                    noStyle // Bỏ style mặc định để căn chỉnh
                                    rules={[{ required: true, message: 'Vui lòng nhập lựa chọn' }]}
                                >
                                    <Input style={{ width: '90%' }} />
                                </Form.Item>
                                {/* Nút xóa lựa chọn, chỉ hiển thị khi có > 2 lựa chọn */}
                                {fields.length > 2 && (
                                    <MinusCircleOutlined
                                        style={{ marginLeft: 8 }}
                                        onClick={() => remove(field.name)}
                                    />
                                )}
                            </Form.Item>
                        ))}

                        {/* Nút thêm lựa chọn mới */}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add('')} block icon={<PlusOutlined />}>
                                Thêm lựa chọn
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>

            {/* Trường chọn đáp án đúng (dùng Radio Group) */}
            <Form.Item
                label="Đáp án đúng"
                name="correct_answer_index"
                rules={[{ required: true, message: 'Vui lòng chọn đáp án đúng' }]}
            >
                <Form.Item dependencies={['options']} noStyle>
                    {({ getFieldValue }) => {
                        const options = getFieldValue('options') || [];

                        return (
                            <Radio.Group
                                // ✨ Dùng onChange để log và cập nhật form
                                onChange={(e) => {
                                    const newIndex = e.target.value;
                                    const optionContent = options[newIndex];

                                    console.log('--- ĐÁP ÁN ĐÚNG THAY ĐỔI (Nội bộ) ---');
                                    console.log(`Chỉ mục mới: ${newIndex}`);
                                    console.log(`Nội dung đáp án: ${optionContent}`);

                                    // BẮT BUỘC AntD Form ghi nhận sự thay đổi này một lần nữa
                                    if (form) {
                                        form.setFieldsValue({
                                            correct_answer_index: newIndex
                                        });
                                    }
                                }}
                            >
                                {options.map((opt, index) => (
                                    <Radio key={index} value={index}>
                                        {`Lựa chọn ${index + 1}`} {opt ? `(${opt})` : ''}
                                    </Radio>
                                ))}
                            </Radio.Group>
                        );
                    }}
                </Form.Item>
            </Form.Item>
        </>
    );
}

export default MultipleChoiceForm;