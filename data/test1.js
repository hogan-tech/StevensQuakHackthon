// chart.js

async function fetchDataAndDrawChart() {
    try {
        // 👇 替换成你同事的 MongoDB 后端 API 地址
        const response = await fetch('https://your-teammate-api.com/api/stats');
        // const data = await response.json();
        const data = [
            { _id: '2025-03-27', count: 3 },
            { _id: '2025-03-28', count: 5 },
            { _id: '2025-03-29', count: 2 }
        ];

        // 预期格式：[{ _id: '2025-03-28', count: 4 }, ...]

        const labels = data.map(item => item._id);        // 日期
        const counts = data.map(item => item.count);      // 每日次数

        const ctx = document.getElementById('chart').getContext('2d');

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: '每日焦慮次數',
                    data: counts,
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });

    } catch (error) {
        console.error('❌ 無法從 API 獲取資料：', error);
    }
}

fetchDataAndDrawChart(); // 頁面加載時自動執行