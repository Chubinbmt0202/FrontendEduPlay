import React from 'react';
import { Form, Input, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

// Component con chịu trách nhiệm render các trường form cho loại Thẻ flash (FlashCard)
function FlashCardForm() {
    return (
        <>
            <p className='mb-[10px]'>Nhập mặt trước mặt sau của thẻ:</p>

            <Form.List name="cards">
                {/* ✨ THÊM add và remove VÀO closure */}
                {(fields, { add, remove }) => (
                    <>
                        {fields.map((field) => (
                            <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="start">

                                {/* Form.Item cho Mặt trước (front) */}
                                <Form.Item
                                    {...field}
                                    name={[field.name, 'front']}
                                    rules={[{ required: true, message: 'Nhập mặt trước' }]}
                                >
                                    {/* Dùng Input.TextArea cho phép nhập nội dung dài hơn */}
                                    <Input.TextArea rows={1} placeholder="Mặt trước" style={{ width: 180 }} />
                                </Form.Item>

                                {/* Form.Item cho Mặt sau (back) */}
                                <Form.Item
                                    {...field}
                                    name={[field.name, 'back']}
                                    rules={[{ required: true, message: 'Nhập mặt sau' }]}
                                >
                                    <Input.TextArea rows={1} placeholder="Mặt sau" style={{ width: 180 }} />
                                </Form.Item>

                                {/* Nút xóa thẻ */}
                                {fields.length > 1 && <MinusCircleOutlined onClick={() => remove(field.name)} />}
                            </Space>
                        ))}

                        {/* ✨ NÚT THÊM THẺ */}
                        <Form.Item>
                            <Button
                                type="dashed"
                                onClick={() => add({ front: '', back: '' })} // Cung cấp giá trị mặc định cho thẻ mới
                                block
                                icon={<PlusOutlined />}
                            >
                                Thêm thẻ
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
        </>
    );
}

export default FlashCardForm;
