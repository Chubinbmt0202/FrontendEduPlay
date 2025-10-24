// src/components/gameForms/MatchingForm.jsx
import React from 'react';
import { Form, Input, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

// Component con chịu trách nhiệm render các trường form cho loại Nối cặp (Matching)
// (Prop 'form' không cần thiết nếu bạn chỉ dùng onValuesChange ở Form cha, nhưng giữ lại nếu cần cho logic phức tạp)
function MatchingForm() {
    return (
        <>
            <p className='mb-[10px]'>Nhập cặp cần nối:</p>

            {/* Form.List để quản lý mảng các cặp (pairs) */}
            {/* ✨ LOẠI BỎ onChange={form.submit} - Nó không cần thiết và gây ra lỗi focus/render */}
            <Form.List name="pairs">
                {(fields) => (
                    <>
                        {fields.map((field) => (
                            // Hiển thị Input cho Item A và Item B trên cùng một dòng
                            // ✨ Dùng field.key DUY NHẤT cho phần tử bọc
                            <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="start">

                                {/* Form.Item cho Item A */}
                                <Form.Item
                                    {...field}
                                    name={[field.name, 'item_a']}
                                    // ✨ LOẠI BỎ fieldKey: đã lỗi thời
                                    rules={[{ required: true, message: 'Nhập mục A' }]}
                                >
                                    <Input placeholder="Item A" style={{ width: 150 }} />
                                </Form.Item>

                                {/* Form.Item cho Item B */}
                                <Form.Item
                                    {...field}
                                    name={[field.name, 'item_b']}
                                    // ✨ LOẠI BỎ fieldKey: đã lỗi thời
                                    rules={[{ required: true, message: 'Nhập mục B' }]}
                                >
                                    <Input placeholder="Item B" style={{ width: 150 }} />
                                </Form.Item>
                            </Space>
                        ))}
                    </>
                )}
            </Form.List>
        </>
    );
}

export default MatchingForm;