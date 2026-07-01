const fs = require('fs');
const path = require('path');

const graphDataPath = path.join(__dirname, '../../data/graph_data.json');

let graphData;
let adjList = {};

try {
    //Doc du lieu do thi mot 1 lan khi server khoi dong
    graphData = JSON.parse(fs.readFileSync(graphDataPath, 'utf-8'));

    buildAdjList(graphData.nodes, graphData.edges);
    console.log("Đã tải dữ liệu đồ thị và khởi tạo danh sách kề thành công!");
} catch (error) {
    console.error("Lỗi khi đọc file dữ liệu đồ thị", error);
    process.exit(1);
}

//Hàm chuyển đổi mảng edges -> danh sách kề
function buildAdjList(nodes, edges) {
    nodes.forEach((n) => (adjList[n.id] = []));
    edges.forEach(({ from, to, weight }) => {
        // Khởi tạo dự phòng nếu ID không hợp lệ
        if (adjList[from] && adjList[to]) {
            adjList[from].push({ to, weight });
            adjList[to].push({ to: from, weight }); // Đồ thị vô hướng
        }
    });
}

module.exports = {
    graphData,
    adjList
};