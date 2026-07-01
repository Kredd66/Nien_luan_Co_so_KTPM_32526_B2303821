const express = require('express');
const router = express.Router();
const { graphData } = require('../services/graphService');

// GET /api/nodes - Lấy tất cả địa điểm (hỗ trợ lọc theo loại qua query param ?type=...)
router.get('/nodes', (req, res) => {
    const { type } = req.query;

    if (type) {
        const filtered = graphData.nodes.filter(node => node.type === type);
        return res.json(filtered);
    }

    return res.json(graphData.nodes);
});

// GET /api/nodes/search - Tìm kiếm địa điểm phục vụ tính năng Autocomplete (?q=...)
router.get('/nodes/search', (req, res) => {
    const { q } = req.query;
    if (!q) {
        return res.status(400).json({ error: 'Vui lòng cung cấp từ khóa tìm kiếm (query ?q=...)' });
    }

    const keyword = q.toLowerCase().trim();
    const results = graphData.nodes.filter(node =>
        node.name && node.name.toLowerCase().includes(keyword)
    );

    return res.json(results);
});

// GET /api/nodes/:id - Xem chi tiết 1 địa điểm bằng ID
router.get('/nodes/:id', (req, res) => {
    const id = Number(req.params.id);
    const node = graphData.nodes.find(n => n.id === id);

    if (!node) {
        return res.status(404).json({ error: `Không tìm thấy địa điểm có ID ${id}` });
    }

    return res.json(node);
});

module.exports = router;
