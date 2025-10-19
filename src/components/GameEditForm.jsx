// src/components/GameEditForm.jsx

import React, { useEffect } from 'react';
import { Form, Input, Button, Space, Radio, Checkbox, InputNumber } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

// Giá trị mặc định cho từng loại câu hỏi khi THÊM MỚI
const getDefaultValues = (gameType) => {
    switch (gameType) {
        case 'multiple_choice_abcd':
            return {
                question_text: '',
                options: ['', '', '', ''],
                correct_answer_index: 0,
            };
        case 'true_false':
            return {
                statement_text: '',
                is_true: true,
            };
        // (Thêm các case khác tại đây)
        default:
            return {};
    }
};

function GameEditForm({ gameType, initialData, onSave, onCancel }) {
    const [form] = Form.useForm();

    // Khi initialData thay đổi (mở modal), 
    // set giá trị cho form
    useEffect(() => {
        if (initialData) {
            form.setFieldsValue(initialData);
        } else {
            // Nếu là THÊM MỚI (initialData = null)
            form.setFieldsValue(getDefaultValues(gameType));
        }
    }, [initialData, gameType, form]);

    const onFinish = (values) => {
        onSave(values);
    };

    // Hàm render các trường form dựa trên gameType
    const renderFormFields = () => {
        switch (gameType) {
            // === FORM CHO TRẮC NGHIỆM ===
            case 'multiple_choice_abcd':
                return (
                    <>
                        <Form.Item
                            name="question_text"
                            label="Câu hỏi"
                            rules={[{ required: true, message: 'Vui lòng nhập câu hỏi' }]}
                        >
                            <Input.TextArea rows={3} />
                        </Form.Item>

                        {/* Form.List cho các lựa chọn A, B, C, D */}
                        <Form.List name="options">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map((field, index) => (
                                        <Form.Item
                                            label={`Lựa chọn ${index + 1}`}
                                            key={field.key}
                                            rules={[{ required: true, message: 'Vui lòng nhập lựa chọn' }]}
                                        >
                                            <Form.Item {...field} noStyle>
                                                <Input style={{ width: '90%' }} />
                                            </Form.Item>
                                            {/* Chỉ cho phép xóa nếu có > 2 lựa chọn */}
                                            {fields.length > 2 ? (
                                                <MinusCircleOutlined
                                                    style={{ marginLeft: 8 }}
                                                    onClick={() => remove(field.name)}
                                                />
                                            ) : null}
                                        </Form.Item>
                                    ))}
                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Thêm lựa chọn
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>

                        <Form.Item
                            name="correct_answer_index"
                            label="Đáp án đúng"
                            rules={[{ required: true, message: 'Vui lòng chọn đáp án' }]}
                        >
                            {/* Lấy giá trị options từ form để render Radio */}
                            <Form.Item dependencies={['options']} noStyle>
                                {({ getFieldValue }) => {
                                    const options = getFieldValue('options') || [];
                                    return (
                                        <Radio.Group>
                                            {options.map((opt, index) => (
                                                <Radio key={index} value={index}>
                                                    {`Lựa chọn ${index + 1}`} ({opt || 'chưa nhập'})
                                                </Radio>
                                            ))}
                                        </Radio.Group>
                                    );
                                }}
                            </Form.Item>
                        </Form.Item>
                    </>
                );

            // === FORM CHO ĐÚNG/SAI ===
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
                        <Form.Item name="is_true" label="Giá trị" valuePropName="checked">
                            <Checkbox>Là ĐÚNG</Checkbox>
                        </Form.Item>
                    </>
                );

            // (Bạn có thể thêm các case khác tại đây cho:
            // fill_in_the_blank, matching, flashcards, sorting)

            default:
                return <Alert message="Loại game này chưa hỗ trợ chỉnh sửa." type="warning" />;
        }
    };

    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            {renderFormFields()}
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