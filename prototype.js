$(function () {
    $("#logoutBtn").on("click", async function () {
        const user = JSON.parse(localStorage.getItem("loggedInUser"));
        if (user && user.userName) {
            const bufferKey = `anxietyBuffer_${user.userName}`;
            const buffer = JSON.parse(localStorage.getItem(bufferKey));

            // // ✅ 若有暫存資料就送出
            // if (buffer && buffer.count > 0) {
            //     try {
            //         await axios.post("http://localhost:3000/anxiety", {
            //             userName: user.userName,
            //             hourKey: buffer.hourKey,
            //             count: buffer.count,
            //         });
            //         console.log("登出前已補送 buffer");
            //     } catch (err) {
            //         console.error("登出前補送失敗：", err);
            //     }
            // }
        }

        // ✅ 然後才清除 localStorage 資料
        localStorage.removeItem("loggedInUser");
        // Object.keys(localStorage).forEach(function (key) {
        //     if (key.startsWith("anxietyBuffer_")) {
        //         localStorage.removeItem(key);
        //     }
        // });

        // ✅ 最後導回登入頁
        window.location.href = "./login.html";
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

                    $("#counter").text(`Today's anxiety count: ${totalCount}`);
                    $("#logList").prepend(
                        `<li>${timestamp} (+${totalCount})</li>`
                    );

                    localStorage.removeItem(bufferKey);
                })
                .catch(function (err) {
                    console.error("Fail", err);
                });
        }
    }

    function addClickToBuffer() {
        const user = getUser();
        // if (!user || !user.userName) {
        //     alert("Please Login First");
        //     return;
        // }

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
