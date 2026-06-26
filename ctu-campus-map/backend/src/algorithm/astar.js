const haversine = require('../utils/haversine');

function aStar(adjList, nodes, sourceId, targetId) {
    //Tạo map để tra cứu thông tin node theo id nhanh hơn
    const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));
    const target = nodeMap[targetId];

    //h(n): hàm heuristic - khoảng cách đường thẳng từ node n đến đích
    const h = (id) => {
        const n = nodeMap[id];
        return haversine(n.lat, n.lng, target.lat, target.lng);
    };

    const g = {};
    const prev = {};
    const closedSet = new Set();

    //Khởi tạo: mọi đỉnh có g = vô cực, trừ nguồn
    nodes.forEach((n) => {
        g[n.id] = Infinity;
        prev[n.id] = null;
    });
    g[sourceId] = 0;

    //openSet: danh sách các đỉnh đang chờ xét, mỗi phần tử có {id, f}
    const openSet = [{ id: sourceId, f: h(sourceId) }];

    while (openSet.length > 0) {
        //Sắp xếp tăng dần theo f, lấy ra đỉnh có f nhỏ nhất
        openSet.sort((a, b) => a.f - b.f);
        const { id: u } = openSet.shift();

        //Nếu đã xét đỉnh này rồi thì bỏ qua
        if (closedSet.has(u)) continue;

        //Nếu đỉnh đang xét chính là đích -> dừng trả kết quả
        if (u == targetId) {
            return buildResult(g, prev, nodes, sourceId, targetId);
        }

        closedSet.add(u);

        //Xác các đỉnh kề với u
        const neighbors = adjList[u] || [];
        for (const { to: v, weight } of neighbors) {
            if (closedSet.has(v)) continue;

            const gNew = g[u] + weight;

            //Nếu tìm được đường đi ngắn hơn đến v -> cập nhật
            if (gNew < g[v]) {
                g[v] = gNew;
                prev[v] = u;
                openSet.push({ id: v, f: gNew + h(v) })
            }
        }
    }
    //Khong tìm được đường đi nào đến đích
    return null;
}
/**
 * Truy vết đường đi từ đích về nguồn, dựa vào mảng prev
 */
function buildResult(g, prev, nodes, sourceId, targetId) {
    const path = [];
    let current = targetId;

    while (current !== null) {
        path.unshift(current);
        current = prev[current];
    }
    //Nếu điểm đầu tiên của path không phải nguồn -> đường đi không hợp lệ
    if (path[0] !== sourceId) return null;

    const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));
    const pathDetails = path.map((id) => nodeMap[id]);

    return {
        algorithm: 'A*',
        distance: Math.round(g[targetId]),
        path,
        pathDetails,
    };
}

module.exports = { aStar };