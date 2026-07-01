const express = require('express');
const router = express.Router();
const { aStar } = require('../algorithm/astar');
const { graphData, adjList } = require('../../src/services/graphService');

//POST /api/shortest-path
router.post('/shortest-path', (req, res) => {
    const { source, target } = req.body;
    //Kiem tra dau vao hop le
    if (source == undefined || target == undefined) {
        return res.status(400).json({ error: 'Thiếu source hoặc target trong request body' });
    }
    const sourceId = Number(source);
    const targetId = Number(target);

    if (sourceId == targetId) {
        return res.status(400).json({ error: 'Điểm xuất phát và đích trùng nhau' });
    }
    // 2. Kiểm tra xem các ID có tồn tại trong dữ liệu đồ thị không
    const validIds = new Set(graphData.nodes.map((n) => n.id));
    if (!validIds.has(sourceId) || !validIds.has(targetId)) {
        return res.status(400).json({ error: 'Source hoặc Target không tồn tại trong sơ đồ' });
    }
    try {
        // 3. Thực thi thuật toán
        const result = aStar(adjList, graphData.nodes, sourceId, targetId);
        if (!result) {
            return res.status(404).json({ error: 'Không tìm thấy đường đi giữa hai địa điểm này' });
        }
        // 4. Trả kết quả về cho client
        return res.json(result);
    } catch (error) {
        console.error("Lỗi khi tính toán đường đi:", error);
        return res.status(500).json({ error: 'Lỗi máy chủ khi xử lý thuật toán' });
    }
});
module.exports = router;