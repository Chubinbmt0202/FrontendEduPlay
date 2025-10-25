import React from 'react';
import { Form, Input, Button, Space, Typography } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Text } = Typography;

// Component con chịu trách nhiệm render các trường form cho loại Sắp xếp (Sorting)
function SortForm() {
    return (
        <>
            <Text strong>Quản lý các Nhóm (Categories):</Text>

            {/* Form.List chính cho danh sách Categories */}
            <Form.List name="categories">
                {(fields, { remove }) => (
                    <>
                        {fields.map((field, categoryIndex) => (
                            <div key={field.key} style={{ padding: '16px', border: '1px solid #d9d9d9', borderRadius: '8px', marginBottom: '16px', background: '#fafafa' }}>
                                <Space style={{ display: 'flex', marginBottom: 8, justifyContent: 'space-between' }}>
                                    {/* Tên Nhóm */}
                                    <Form.Item
                                        {...field}
                                        name={[field.name, 'category_name']}
                                        label={`Tên Nhóm ${categoryIndex + 1}`}
                                        rules={[{ required: true, message: 'Vui lòng nhập tên nhóm' }]}
                                        style={{ marginBottom: 0, flexGrow: 1 }}
                                    >
                                        <Input placeholder="Ví dụ: Tổng bé hơn 10" />
                                    </Form.Item>

                                    {/* Nút xóa nhóm */}
                                    {fields.length > 1 && (
                                        <MinusCircleOutlined
                                            onClick={() => remove(field.name)}
                                            style={{ marginTop: '38px', fontSize: '18px', color: '#ff4d4f' }}
                                        />
                                    )}
                                </Space>

                                <Text strong>Các Mục trong nhóm:</Text>

                                {/* Form.List LỒNG NHAU cho các Items trong Category */}
                                <Form.List name={[field.name, 'items']}>
                                    {(itemFields, { add: addItem, remove: removeItem }) => (
                                        <div style={{ paddingLeft: '12px', borderLeft: '2px solid #ccc' }}>
                                            {itemFields.map((itemField, itemIndex) => (
                                                <Space key={itemField.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                                    {/* Input cho Mục */}
                                                    <Form.Item
                                                        {...itemField}
                                                        rules={[{ required: true, message: 'Vui lòng nhập mục' }]}
                                                        style={{ marginBottom: 0 }}
                                                    >
                                                        <Input placeholder={`Mục ${itemIndex + 1}`} style={{ width: 200 }} />
                                                    </Form.Item>

                                                    {/* Nút xóa Mục */}
                                                    {itemFields.length > 1 && (
                                                        <MinusCircleOutlined onClick={() => removeItem(itemField.name)} />
                                                    )}
                                                </Space>
                                            ))}

                                            {/* Nút Thêm Mục */}
                                            <Form.Item style={{ marginTop: 8, marginBottom: 0 }}>
                                                <Button
                                                    type="dashed"
                                                    onClick={() => addItem('')} // Thêm mục rỗng
                                                    block
                                                    icon={<PlusOutlined />}
                                                >
                                                    Thêm mục vào nhóm này
                                                </Button>
                                            </Form.Item>
                                        </div>
                                    )}
                                </Form.List>
                            </div>
                        ))}
                    </>
                )}
            </Form.List>
        </>
    );
}

export default SortForm;
