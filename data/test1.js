// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.static('public')); // 让 index.html 可访问
app.use(express.json());

// MongoDB 连接（换成你自己的 URI）
mongoose.connect('你的 MongoDB URI', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const LogSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now }
});
const Log = mongoose.model('Log', LogSchema);

// 获取每日统计数据
app.get('/api/stats', async (req, res) => {
    const stats = await Log.aggregate([
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);
    res.json(stats);
});

app.listen(3000, () => {
    console.log('✅ Server running on http://localhost:3000');
});