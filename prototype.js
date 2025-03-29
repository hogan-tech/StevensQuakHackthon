$(function () {
    $("#logoutBtn").on("click", function () {
        localStorage.removeItem("loggedInUser");

        // （可選）也清除暫存點擊資料
        Object.keys(localStorage).forEach(function (key) {
            if (key.startsWith("anxietyBuffer_")) {
                localStorage.removeItem(key);
            }
        });

        // 導回登入頁
        window.location.href = "login.html";
    });

    let hourlyTimer = null;

    function getUser() {
        return JSON.parse(localStorage.getItem("loggedInUser"));
    }

    function getHourKey(date = new Date()) {
        return date.toISOString().slice(0, 13); // 例如 "2025-03-29T14"
    }

    function getBufferKey(userName) {
        return `anxietyBuffer_${userName}`;
    }

    function sendBufferedAnxiety() {
        const user = getUser();
        if (!user || !user.userName) return;

        const bufferKey = getBufferKey(user.userName);
        const buffer = JSON.parse(localStorage.getItem(bufferKey));

        if (buffer && buffer.count > 0) {
            axios
                .post("http://localhost:3000/anxiety", {
                    userName: user.userName,
                    hourKey: buffer.hourKey,
                    count: buffer.count,
                })
                .then(function (res) {
                    const { timestamp, totalCount } = res.data;

                    $("#counter").text(`今日焦慮次數: ${totalCount}`);
                    $("#logList").prepend(
                        `<li>${timestamp} (+${buffer.count})</li>`
                    );

                    localStorage.removeItem(bufferKey);
                })
                .catch(function (err) {
                    console.error("補送失敗：", err);
                });
        }
    }

    function addClickToBuffer() {
        const user = getUser();
        if (!user || !user.userName) {
            alert("請先登入！");
            return;
        }

        const bufferKey = getBufferKey(user.userName);
        const now = new Date();
        const hourKey = getHourKey(now);

        let buffer = JSON.parse(localStorage.getItem(bufferKey)) || {};
        if (buffer.hourKey !== hourKey) {
            buffer = { hourKey, count: 0 };
        }

        buffer.count++;
        localStorage.setItem(bufferKey, JSON.stringify(buffer));

        // 畫面立即更新 log
        const timeString = now.toLocaleTimeString();
        const dateString = now.toLocaleDateString();
        $("#logList").prepend(`<li>${dateString} ${timeString}</li>`);

        const currentText = $("#counter").text();
        const currentCount = parseInt(currentText.match(/\d+/)?.[0] || 0);
        $("#counter").text(`Today's anxiety count: ${currentCount + 1}`);
    }

    function scheduleHourlyFlush() {
        if (hourlyTimer === null) {
            hourlyTimer = setInterval(function () {
                sendBufferedAnxiety();
            }, 60 * 60 * 1000); // 每一小時執行一次
        }
    }

    // 初始化時先補送舊資料
    sendBufferedAnxiety();
    scheduleHourlyFlush();

    // 點擊按鈕記錄焦慮
    $("#trackButton").on("click", function () {
        addClickToBuffer();
    });
});
