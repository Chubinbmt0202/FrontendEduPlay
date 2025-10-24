import React, { useState, useEffect, useRef } from 'react';
import { Upload, Button, Input, Form, Spin, Result } from 'antd';
import { UploadOutlined, LoadingOutlined, CheckCircleOutlined, RedoOutlined } from '@ant-design/icons';

const PdfUploaderPage = () => {
    const [form] = Form.useForm();
    // Thêm trạng thái 'result'
    const [status, setStatus] = useState('form');
    const [currentStep, setCurrentStep] = useState(0);
    // Ref để lưu trữ ID của interval/timeout để dọn dẹp
    const intervalRef = useRef(null);

    const loadingSteps = [
        "Chúng tôi đang đọc bài giảng của bạn 📚",
        "Chúng tôi đang phân tích nội dung 🧐",
        "Chúng tôi đang tạo bộ câu hỏi 🎉",
        "Chờ chút xíu nữa thôi 😉"
    ];

    // Dọn dẹp interval khi component unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const onFinish = (values) => {
        console.log('Submitted values:', values);

        // 1. Chuyển sang trạng thái 'loading'
        setStatus('loading');
        setCurrentStep(0);

        // Xóa interval cũ nếu có (quan trọng cho việc dọn dẹp)
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // 2. Thiết lập interval để chuyển đổi giữa các bước loading (ví dụ: mỗi 3 giây)
        let step = 0;
        intervalRef.current = setInterval(() => {
            step++;
            // Chuyển đổi thông báo tuần hoàn (tránh vượt quá mảng)
            setCurrentStep(step % loadingSteps.length);
        }, 3000); // Thay đổi thông báo mỗi 3 giây

        // 3. Thiết lập setTimeout để chuyển sang trạng thái 'result' sau 30 giây
        setTimeout(() => {
            // Dừng interval animation
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            // Chuyển sang trạng thái kết quả
            setStatus('result');

        }, 10000); // 30 giây
    };

    const handleCreateNew = () => {
        // Xử lý tạo lại bộ đề: reset form và trạng thái
        form.resetFields();
        setStatus('form');
        setCurrentStep(0);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };

    const uploadProps = {
        name: 'file',
        multiple: true,
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        beforeUpload: () => false,
    };

    // Component/Phần hiển thị Animation Loading
    const LoadingAnimation = () => (
        <div className="flex-1 border-2 bg-blue-50 border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center text-center p-10 space-y-8">
            <Spin indicator={<LoadingOutlined style={{ fontSize: 60, color: '#1890ff' }} spin />} />
            <p className="text-4xl font-bold text-blue-700 h-20 flex items-center justify-center transition-opacity duration-1000 ease-in-out">
                {loadingSteps[currentStep]}
            </p>
            <p className="text-gray-500 text-lg">Quá trình này có thể mất một chút thời gian. Vui lòng giữ nguyên trang.</p>
        </div>
    );

    // Component/Phần hiển thị Kết quả
    const ResultSection = () => (
        <div className="flex-1 border-2 bg-green-50 border-solid border-green-300 rounded-lg flex flex-col justify-center items-center text-center p-10 space-y-8">
            <CheckCircleOutlined style={{ fontSize: 60, color: '#52c41a' }} />
            <h2 className="text-4xl font-bold text-green-700 mt-[20px]">Tạo bộ câu hỏi thành công!</h2>
            <p className="text-gray-600 text-lg mt-[10px]">Hệ thống đã hoàn thành việc tạo bộ đề của bạn.</p>

            <div className="flex space-x-4 mt-6 mt-[30px]">
                <Button
                    type="primary"
                    size="large"
                    className="bg-blue-500 hover:bg-blue-600 border-none px-8 h-12 mr-[10px]"
                    // Thêm logic xem thử bộ đề ở đây
                    onClick={() => console.log('Xem thử bộ đề')}
                >
                    Xem thử bộ đề
                </Button>
                <Button
                    icon={<RedoOutlined />}
                    size="large"
                    className="h-12 border-blue-500 text-blue-500 hover:border-blue-600 hover:text-blue-600"
                    onClick={handleCreateNew}
                >
                    Tạo lại bộ đề
                </Button>
            </div>
        </div>
    );

    // Component/Phần hiển thị Upload File (mặc định)
    const UploadSection = () => (
        <div className="flex-1 border-2 bg-blue-50 border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center text-center p-10">
            <p className="text-4xl font-semibold text-gray-800">Kéo hoặc thả file</p>
            <p className="text-4xl font-semibold text-gray-800"> pdf tại đây</p>
            <p className="text-gray-600 mt-[10px] mb-[50px]">hoặc nhấp vào nút "Tải lên file"</p>
            <Upload {...uploadProps} accept=".pdf">
                <Button icon={<UploadOutlined />} className="w-[300px] h-[60px] hover:bg-blue-600 border-none px-6 py-3 rounded-md">
                    Tải lên file
                </Button>
            </Upload>
        </div>
    );

    // Logic hiển thị phần bên trái
    const renderLeftSection = () => {
        if (status === 'loading') {
            return <LoadingAnimation />;
        }
        if (status === 'result') {
            return <ResultSection />;
        }
        return <UploadSection />;
    };

    return (
        <>
            <h1 className='font-bold text-4xl p-[30px]'>Cung cấp tài liệu của bạn</h1>
            <div className="flex justify-center items-center bg-gray-100 p-10">
                <div className="bg-white h-[500px] rounded-lg w-full max-w-8xl flex shadow-xl/30">
                    {/* Left Section: Hiển thị dựa trên trạng thái */}
                    {renderLeftSection()}

                    {/* Right Section: Additional Information */}
                    <div className=" p-[50px] rounded-lg ml-[10px] w-full max-w-md">
                        <h2 className="text-2xl font-bold text-left text-gray-800">Bổ sung thêm thông tin</h2>
                        <p className="text-gray-600 italic text-left">Thông tin này sẽ giúp chúng tôi hiểu rõ hơn về yêu cầu của bạn.</p>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            className="space-y-4 mt-[20px]"
                        >
                            <Form.Item
                                label="Bạn đang giảng dạy lớp mấy?"
                                name="classTaught"
                                rules={[{ required: true, message: 'Vui lòng nhập lớp bạn đang giảng dạy!' }]}
                            >
                                <Input
                                    className='p-[10px]'
                                    placeholder="Ví dụ: Lớp 10A1"
                                    // Vô hiệu hóa input khi đang loading/result
                                    disabled={status !== 'form'}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Bạn muốn có bao nhiêu câu hỏi trong 1 bài?"
                                name="numQuestions"
                                rules={[{ required: true, message: 'Vui lòng nhập số lượng câu hỏi!' }]}
                            >
                                <Input
                                    className='p-[10px]'
                                    type="number"
                                    placeholder="Ví dụ: 20"
                                    min={1}
                                    // Vô hiệu hóa input khi đang loading/result
                                    disabled={status !== 'form'}
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    // Chỉ cho phép submit khi ở trạng thái 'form'
                                    disabled={status !== 'form'}
                                    className="w-[200px] h-[50px] mt-[20px] bg-blue-500 text-white hover:bg-blue-600 border-none px-6 py-3 rounded-md"
                                >
                                    {status === 'loading' ? 'Đang Xử Lý...' : 'Tạo bộ câu hỏi'}
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PdfUploaderPage;