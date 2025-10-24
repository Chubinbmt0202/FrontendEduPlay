// src/pages/TeacherDashboard.jsx

import React from 'react';
import { Button, Layout } from 'antd';
import '../../index.css'; // Cập nhật đường dẫn
import GameDrawer from '../../components/GameDrawer'; // Cập nhật đường dẫn
import PdfUploaderPage from '../../components/UploadV2';

const { Content } = Layout;
function TeacherDashboard() {
    return (
        <div>
            <PdfUploaderPage />
        </div>
    );
}

export default TeacherDashboard;