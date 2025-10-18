import React from 'react';
import { Button, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import './App.css';

function App() {
  const [FileList, setFileList] = React.useState([]);
  const [uploading, setUploading] = React.useState(false);
  const [messageApi, contextHolder] = message.useMessage();

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

      messageApi.info('Đã tạo bộ dữ liệu thành công!');
      console.log('Response from backend:', result);
      // alert('Response from backend: ' + JSON.stringify(result));
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
      // Thêm file mới vào danh sách. Trả về false để ngăn Upload tự động upload
      setFileList((prevList) => [...prevList, file]);
      return false;
    },
    fileList: FileList,
  };

  return (
    <div style={{ padding: 50 }}>
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
        {/* <br /> */}
        {contextHolder}
      </Button>
    </div>
  );
}

export default App;