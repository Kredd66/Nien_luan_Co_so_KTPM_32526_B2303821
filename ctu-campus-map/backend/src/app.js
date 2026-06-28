require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { aStar } = require('../src/algorithm/astar');

const app = express()
app.use(cors());
app.use(express.json())

// Đọc dữ liệu đồ thị 1 lần khi server khởi động
const graphDataPath = path.join(__dirname, '../data/graph_data.json');
const graphData = JSON.parse(fs.readFileSync(graphDataPath, 'utf-8'));

// Chuyển mảng edges -> danh sách kề (adjacency list)
function buildAdjList(nodes, edges) {
    const adj = {};
    nodes.forEach((n) => (adj[n.id] = []));
    edges.forEach(({ from, to, weight }) => {
        adj[from].push({ to, weight });
        adj[to].push({ to: from, weight }); // đồ thị vô hướng
    });
    return adj;
}

const adjList = buildAdjList(graphData.nodes, graphData.edges);

// ─── ROUTES ───────────────────────────────────────

app.get('/api/graph', (req, res) => {
    res.json(graphData);
});

app.post('/api/shortest-path', (req, res) => {
    const { source, target } = req.body;

    if (source === undefined || target === undefined) {
        return res.status(400).json({ error: 'Thiếu source hoặc target' });
    }

    const sourceId = Number(source);
    const targetId = Number(target);

    if (sourceId === targetId) {
        return res.status(400).json({ error: 'Điểm xuất phát và đích trùng nhau' });
    }
    const validIds = new Set(graphData.nodes.map((n) => n.id));
    if (!validIds.has(sourceId) || !validIds.has(targetId)) {
        return res.status(400).json({ error: 'source hoặc target không tồn tại trong đồ thị' });
    }

    const result = aStar(adjList, graphData.nodes, sourceId, targetId);

    if (!result) {
        return res.status(404).json({ error: 'Không tìm thấy đường đi' });
    }

    res.json(result);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});