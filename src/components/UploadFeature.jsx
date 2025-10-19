// src/components/UploadFeature.jsx

import React from 'react';
import { Button, message, Upload, Drawer, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

function UploadFeature() {
    const [FileList, setFileList] = React.useState([]);
    const [uploading, setUploading] = React.useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    // State riêng cho Drawer kết quả
    const [isResultDrawerOpen, setIsResultDrawerOpen] = React.useState(false);
    const [uploadResult, setUploadResult] = React.useState(null);

    // URL API Backend thực tế của bạn
    const BACKEND_API_URL = 'http://localhost:3000/api/test';

    const handleUpload = async () => {
        setUploading(true);

        const formData = new FormData();
        FileList.forEach((file) => {
            formData.append('document', file);
        });

        try {
            const response = await fetch(BACKEND_API_URL, {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();

            // Mở Drawer kết quả và lưu data
            setUploadResult(result);
            setIsResultDrawerOpen(true); // Chỉ mở Drawer này

            console.log('Response from backend:', result);
        } catch (error) {
            console.error('Error uploading files:', error);
            messageApi.error('Tạo bộ dữ liệu thất bại.');
        } finally {
            setUploading(false);
            setFileList([]);
        }
    };

    const props = {
        onRemove: (file) => {
            const index = FileList.indexOf(file);
            const newFileList = FileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            setFileList((prevList) => [...prevList, file]);
            return false;
        },
        fileList: FileList,
    };

    const onCloseDrawer = () => {
        setIsResultDrawerOpen(false);
    };

    return (
        // Bọc trong 1 div để chứa contextHolder
        <div>
            {contextHolder}

            <h1>Demo Upload & Call API Backend</h1>
            <Upload {...props}>
                <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
            <Button
                type="primary"
                onClick={handleUpload}
                disabled={FileList.length === 0}
                loading={uploading}
                style={{ marginTop: 16 }}
            >
                {uploading ? 'Uploading & Processing...' : 'Start Upload & Process'}
            </Button>

            {/* Drawer chỉ để hiển thị kết quả Upload */}
            <Drawer
                title="Upload thành công"
                placement="right"
                onClose={onCloseDrawer}
                open={isResultDrawerOpen} // Dùng state của riêng component này
                width={500}
                extra={
                    <Space>
                        <Button onClick={onCloseDrawer}>Đóng</Button>
                        <Button type="primary" onClick={onCloseDrawer}>
                            OK
                        </Button>
                    </Space>
                }
            >
                <p>Dữ liệu đã được xử lý và đây là kết quả trả về từ server:</p>
                <pre>
                    {uploadResult ? JSON.stringify(uploadResult, null, 2) : 'Đang tải...'}
                </pre>
            </Drawer>
        </div>
    );
}

export default UploadFeature;