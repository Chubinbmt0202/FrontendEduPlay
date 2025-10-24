// src/components/GameEditForm.jsx
import React, { useEffect } from 'react';
import { Form, Input, Button, Space, Radio, Checkbox, Alert } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

// Giá trị mặc định cho từng loại câu hỏi khi thêm mới
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
        case 'fill_in_the_blank':
            return {
                sentence_with_blank: '',
                answer: '',
            };
        case 'matching':
            return {
                instruction: '',
                pairs: [{ item_a: '', item_b: '' }],
            };
        case 'flashcards':
            return {
                deck_title: '',
                cards: [{ front: '', back: '' }],
            };
        case 'sorting':
            return {
                instruction: '',
                categories: [{ category_name: '', items: [] }],
            };
        default:
            return {};
    }
};

function GameEditForm({ gameType, initialData, onSave, onCancel }) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (initialData) {
            form.setFieldsValue(initialData);
        } else {
            form.setFieldsValue(getDefaultValues(gameType));
        }
    }, [initialData, gameType, form]);

    const onFinish = (values) => {
        // đảm bảo trả về 1 bản sao (không bắt reference ngoại)
        // (nhiều kiểu game có cấu trúc mảng — clone để an toàn)
        const cloned = JSON.parse(JSON.stringify(values));
        onSave(cloned);
    };

    const renderFormFields = () => {
        switch (gameType) {
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
                                            {fields.length > 2 && (
                                                <MinusCircleOutlined
                                                    style={{ marginLeft: 8 }}
                                                    onClick={() => remove(field.name)}
                                                />
                                            )}
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

            case 'fill_in_the_blank':
                return (
                    <>
                        <Form.Item
                            name="sentence_with_blank"
                            label="Câu (dùng ___ cho chỗ trống)"
                            rules={[{ required: true, message: 'Vui lòng nhập câu' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item name="answer" label="Đáp án" rules={[{ required: true, message: 'Vui lòng nhập đáp án' }]}>
                            <Input />
                        </Form.Item>
                    </>
                );

            case 'matching':
                return (
                    <>
                        <Form.Item name="instruction" label="Hướng dẫn">
                            <Input />
                        </Form.Item>
                        <Form.List name="pairs">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map((field) => (
                                        <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="start">
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'item_a']}
                                                fieldKey={[field.fieldKey, 'item_a']}
                                                rules={[{ required: true, message: 'Nhập mục A' }]}
                                            >
                                                <Input placeholder="Item A" />
                                            </Form.Item>
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'item_b']}
                                                fieldKey={[field.fieldKey, 'item_b']}
                                                rules={[{ required: true, message: 'Nhập mục B' }]}
                                            >
                                                <Input placeholder="Item B" />
                                            </Form.Item>
                                            {fields.length > 1 && <MinusCircleOutlined onClick={() => remove(field.name)} />}
                                        </Space>
                                    ))}
                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Thêm cặp
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </>
                );

            case 'flashcards':
                return (
                    <>
                        <Form.Item name="deck_title" label="Tiêu đề bộ thẻ">
                            <Input />
                        </Form.Item>
                        <Form.List name="cards">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map((field) => (
                                        <div key={field.key} style={{ marginBottom: 8 }}>
                                            <Space align="start">
                                                <Form.Item
                                                    {...field}
                                                    name={[field.name, 'front']}
                                                    fieldKey={[field.fieldKey, 'front']}
                                                    rules={[{ required: true, message: 'Nhập mặt trước' }]}
                                                >
                                                    <Input placeholder="Front" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...field}
                                                    name={[field.name, 'back']}
                                                    fieldKey={[field.fieldKey, 'back']}
                                                    rules={[{ required: true, message: 'Nhập mặt sau' }]}
                                                >
                                                    <Input placeholder="Back" />
                                                </Form.Item>
                                                {fields.length > 0 && <MinusCircleOutlined onClick={() => remove(field.name)} />}
                                            </Space>
                                        </div>
                                    ))}
                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Thêm thẻ
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </>
                );

            case 'sorting':
                return (
                    <>
                        <Form.Item name="instruction" label="Hướng dẫn">
                            <Input />
                        </Form.Item>
                        <Form.List name="categories">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map((field) => (
                                        <div key={field.key} style={{ marginBottom: 8 }}>
                                            <Space direction="vertical" style={{ width: '100%' }}>
                                                <Form.Item
                                                    {...field}
                                                    name={[field.name, 'category_name']}
                                                    fieldKey={[field.fieldKey, 'category_name']}
                                                    rules={[{ required: true, message: 'Nhập tên category' }]}
                                                >
                                                    <Input placeholder="Tên category" />
                                                </Form.Item>
                                                <Form.List name={[field.name, 'items']}>
                                                    {(itemFields, { add: addItem, remove: removeItem }) => (
                                                        <>
                                                            {itemFields.map((it) => (
                                                                <Space key={it.key} style={{ display: 'flex', marginBottom: 8 }} align="start">
                                                                    <Form.Item {...it} noStyle name={[it.name]} fieldKey={[it.fieldKey]}>
                                                                        <Input placeholder="Item" />
                                                                    </Form.Item>
                                                                    {itemFields.length > 0 && <MinusCircleOutlined onClick={() => removeItem(it.name)} />}
                                                                </Space>
                                                            ))}
                                                            <Button type="dashed" onClick={() => addItem()} icon={<PlusOutlined />}>
                                                                Thêm item
                                                            </Button>
                                                        </>
                                                    )}
                                                </Form.List>
                                                <Button type="link" danger onClick={() => remove(field.name)}>
                                                    Xóa category
                                                </Button>
                                            </Space>
                                        </div>
                                    ))}
                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Thêm category
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </>
                );

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
