import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Upload, message, Button, Input, Form, Spin, Result } from 'antd';
import { UploadOutlined, LoadingOutlined, CheckCircleOutlined, RedoOutlined } from '@ant-design/icons';
import { useLessonData } from '../context/LessonDataContext';
import GameDrawer from '../components/GameDrawer';

// Hàm helper cho GameDrawer
const getItemArrayKey = (game) => {
    if (game.questions) return 'questions';
    if (game.statements) return 'statements';
    if (game.sentences) return 'sentences';
    if (game.pairs) return 'pairs';
    if (game.cards) return 'cards';
    if (game.categories) return 'categories';
    return null;
};

const PdfUploaderPage = () => {
    const [form] = Form.useForm();
    const [status, setStatus] = useState('form');
    const [currentStep, setCurrentStep] = useState(0);
    const intervalRef = useRef(null);
    const BACKEND_API_URL = 'https://musterclassyjut.onrender.com/api/test';
    const [FileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const { lessonData, updateLessonData } = useLessonData();
    const [isGameDrawerOpen, setIsGameDrawerOpen] = React.useState(false);

    const showGameDrawer = () => {
        console.log("Opening Game Drawer");
        console.log("Lesson Data trong showGameDrawer:", lessonData);
        setIsGameDrawerOpen(true);
    }

    const onCloseGameDrawer = () => {
        setIsGameDrawerOpen(false);
    };

    // --- Logic CRUD cho GameDrawer (giữ nguyên) ---
    const handleAddItem = (gameIndex, newItemData) => {
        updateLessonData((prevData) => {
            const newData = JSON.parse(JSON.stringify(prevData));
            const game = newData.generated_games[gameIndex];
            const key = getItemArrayKey(game);
            if (key) {
                game[key].push(newItemData);
            }
            return newData;
        });
    };

    const handleUpdateItem = (gameIndex, itemIndex, updatedItemData) => {
        updateLessonData((prevData) => {
            const newData = JSON.parse(JSON.stringify(prevData));
            const game = newData.generated_games[gameIndex];
            const key = getItemArrayKey(game);
            if (key && game[key][itemIndex]) {
                game[key][itemIndex] = updatedItemData;
            }
            return newData;
        });
    };

    const handleDeleteItem = (gameIndex, itemIndex) => {
        updateLessonData((prevData) => {
            const newData = JSON.parse(JSON.stringify(prevData));
            const game = newData.generated_games[gameIndex];
            const key = getItemArrayKey(game);
            if (key && game[key][itemIndex]) {
                game[key].splice(itemIndex, 1);
            }
            return newData;
        });
    };
    // The handleUpload function provided in the prompt is placed here (or imported)
    // and is now a self-contained function within the component scope.
    const handleUpload = useCallback(async (value) => {
        // --- 1. START UPLOAD PROCESS & LOADING ANIMATION ---
        const { classTaught, numQuestions } = value;
        setUploading(true);
        setStatus('loading');
        setCurrentStep(0);

        // Start the loading step animation
        let step = 0;
        intervalRef.current = setInterval(() => {
            step++;
            setCurrentStep(step % loadingSteps.length);
        }, 3000);

        const formData = new FormData();
        if (classTaught > 5) {
            alert('Cảnh báo: Lớp học cao hơn lớp 5 có thể không được hỗ trợ đầy đủ. Mong bạn nhập lại lớp');
        } else if (numQuestions > 10) {
            alert('Cảnh báo: Số lượng câu hỏi quá lớn có thể gây chậm trễ trong xử lý hoặc sẽ thiếu cho bài kiểm tra.');
        } else {
            formData.append('classTaught', classTaught);
            formData.append('numQuestions', numQuestions);
            FileList.forEach((file) => {
                formData.append('document', file, value);
            });
        }


        // Add form data to the upload payload if needed by the backend
        // Note: The backend might expect these as part of the JSON response,
        // but if it expects them as part of the FormData, add them here.
        // For simplicity, we'll focus on the file upload logic for now.

        let uploadSuccess = false;
        console.log("Uploading files ở frontends:", formData);

        try {
            const response = await fetch(BACKEND_API_URL, {
                method: 'POST',
                // Important: FormData boundary is automatically set by the browser
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

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
                        uploadSuccess = true; // Mark as success

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
            // --- 2. STOP LOADING ANIMATION AND SET FINAL STATUS ---
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            setUploading(false);
            setFileList([]); // Clear file list after attempt

            // Transition to 'result' state only on successful JSON update
            setStatus(uploadSuccess ? 'result' : 'form');
        }
    }, [FileList, updateLessonData, messageApi]); // Dependencies for useCallback


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

    // --- NEW LOGIC: onFinish now just calls the async handleUpload ---
    const onFinish = (values) => {
        console.log('Submitted values:', values);

        // Ensure files are selected before uploading
        if (FileList.length === 0) {
            messageApi.warning('Vui lòng chọn ít nhất một file PDF để tải lên.');
            return;
        }

        // Start the upload process, which also handles setting 'loading' status
        handleUpload(values);
    };

    // --- NEW LOGIC: Use handleClick to trigger validation and onFinish ---
    const handleClick = () => {
        // Manually trigger form validation. If validation passes, onFinish is called.

        form.submit();
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
        // The Antd Upload component usually sends the file to the 'action' URL, 
        // but since we want to handle it ourselves with 'fetch', we use 
        // 'beforeUpload: () => false' to prevent default upload and manage the file list.
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76', // Placeholder URL
        beforeUpload: () => false, // Prevent default upload
        onRemove: (file) => {
            setFileList((prevList) => prevList.filter((f) => f.uid !== file.uid));
        },
        onChange: ({ fileList }) => {
            // Only keep files that are not yet uploaded (status 'uploading' or 'error' are ok, but here we just take the raw list)
            setFileList(fileList.map(f => f.originFileObj || f));
        },
        fileList: FileList,
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
                    onClick={showGameDrawer}
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
            {/* The actual Antd Upload component which manages the FileList state */}
            <Upload {...uploadProps} accept=".pdf">
                <Button
                    icon={<UploadOutlined />}
                    className="w-[300px] h-[60px] bg-blue-500 text-white hover:bg-blue-600 border-none px-6 py-3 rounded-md"
                >
                    Tải lên file
                </Button>
            </Upload>
            {/* Display the list of selected files */}
            {FileList.length > 0 && (
                <div className="mt-4 text-sm text-gray-600">
                    Đã chọn **{FileList.length}** file.
                </div>
            )}
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
            {contextHolder} {/* Important for Ant Design message API */}
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
                            onFinish={onFinish} // This now calls handleUpload indirectly
                            className="space-y-4 mt-[20px]"
                        >
                            <Form.Item
                                label="Bạn đang giảng dạy lớp mấy?"
                                name="classTaught"
                                rules={[{ required: true, message: 'Vui lòng nhập lớp bạn đang giảng dạy!' }]}
                            >
                                <Input
                                    className='p-[10px]'
                                    placeholder="Ví dụ: Lớp 2"
                                    disabled={status !== 'form' || uploading}
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
                                    placeholder="Ví dụ: 4"
                                    min={1}
                                    disabled={status !== 'form' || uploading}
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="button" // Change to 'button' so it doesn't submit by default
                                    onClick={handleClick} // Now triggers validation/upload
                                    disabled={status !== 'form' || uploading || FileList.length === 0}
                                    loading={uploading}
                                    className="w-[200px] h-[50px] mt-[20px] bg-blue-500 text-white hover:bg-blue-600 border-none px-6 py-3 rounded-md"
                                >
                                    {uploading ? 'Đang Xử Lý...' : 'Tạo bộ câu hỏi'}
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>

            <GameDrawer
                open={isGameDrawerOpen}
                onClose={onCloseGameDrawer}
                data={lessonData}
                onAddItem={handleAddItem}
                onUpdateItem={handleUpdateItem}
                onDeleteItem={handleDeleteItem}
            />
        </>
    );
};

export default PdfUploaderPage;