require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import các router chúng ta vừa viết
const navigationRouter = require('./routes/navigation');
const nodesRouter = require('./routes/nodes');

const app = express();

// Cấu hình Middleware
app.use(cors());
app.use(express.json());

// Đăng ký các Route với tiền tố là "/api"
app.use('/api', navigationRouter);
app.use('/api', nodesRouter);

// (Tùy chọn) Endpoint mặc định để kiểm tra trạng thái server hoạt động
app.get('/', (req, res) => {
    res.json({ message: "Welcome to CTU Campus Map API! Server is running smoothly." });
});

// Middleware xử lý lỗi tập trung khi có lỗi phát sinh không mong muốn
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Đã xảy ra lỗi không mong muốn trên hệ thống!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});
