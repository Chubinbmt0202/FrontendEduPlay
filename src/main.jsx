import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'; // 3. Cập nhật đường dẫn CSS nếu cần
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import { LessonDataProvider } from './context/LessonDataContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LessonDataProvider>
        <App />
      </LessonDataProvider>
    </BrowserRouter>
  </StrictMode>,
)
