// src/components/UploadFeature.jsx

import React, { useState } from 'react'; // 1. Sửa lại import, chỉ giữ cái cần thiết
import { Button, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useLessonData } from '../context/LessonDataContext'; // 4. Import context

// 2. Nhận onUploadSuccess qua props
function UploadFeature() {
    const [FileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const { updateLessonData } = useLessonData(); // 4. Sử dụng context
    // 3. Xóa tất cả state của Drawer riêng
    // const [isResultDrawerOpen, setIsResultDrawerOpen] = React.useState(false);
    // const [uploadResult, setUploadResult] = React.useState(null);

    // URL API Backend thực tế của bạn
    const BACKEND_API_URL = 'https://musterclassyjut.onrender.com/api/test';

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
            // đọc JSON
            // 1. Get the raw backend response
            const backendResponse = await response.json();
            console.log("Raw backend response:", backendResponse);

            // 2. Check if the 'result' field exists and is a string
            if (backendResponse.result && typeof backendResponse.result === 'string') {

                // 3. Clean the string: Remove ```json\n and ```
                let jsonString = backendResponse.result;
                jsonString = jsonString.replace(/^```json\n/, ''); // Remove prefix
                jsonString = jsonString.replace(/\n```$/, '');    // Remove suffix

                console.log("Cleaned JSON string:", jsonString);

                try {
                    // 4. Parse the CLEANED string
                    const lessonDataPayload = JSON.parse(jsonString);
                    console.log("Parsed Lesson Data:", lessonDataPayload);

                    // 5. Call updateLessonData with the PARSED object
                    const success = updateLessonData(lessonDataPayload);

                    if (success) {
                        messageApi.success('Tải bộ đề mới thành công!');

                    } else {
                        // This error should now only appear if the *parsed* JSON is invalid
                        messageApi.error('Lỗi: Dữ liệu JSON không đúng định dạng sau khi phân tích.');
                    }

                } catch (parseError) {
                    console.error("Error parsing JSON string:", parseError);
                    messageApi.error('Lỗi khi phân tích dữ liệu JSON từ backend.');
                }

            } else {
                console.error("Backend response is missing 'result' string:", backendResponse);
                messageApi.error('Lỗi: Định dạng phản hồi từ backend không đúng.');
            }

        } catch (error) {
            console.error('Error uploading files:', error);
            messageApi.error('Upload bộ đề thất bại.');
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

    // 5. Xóa hàm onCloseDrawer

    return (
        <div style={{ paddingBottom: 24, borderBottom: '1px solid #f0f0f0' }}>
            {contextHolder}

            <h1>Tải lên bộ đề mới</h1>
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
                {uploading ? 'Đang xử lý...' : 'Tải lên & Tạo bộ đề'}
            </Button>

            {/* 6. Xóa <Drawer> hiển thị kết quả upload */}
        </div>
    );
}

export default UploadFeature;