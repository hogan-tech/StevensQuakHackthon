$(function () {
    $("#trackButton").on("click", function () {
        axios
            .get("http://localhost:3000/anxiety")
            .then(function (response) {
                const { timestamp, count } = response.data;

                $("#counter").text(`今日焦慮次數: ${count}`);
                $("#logList").prepend(`<li>${timestamp}</li>`);
            })
            .catch(function (error) {
                console.error("Error logging anxiety:", error);
                alert("記錄失敗，請稍後再試");
            });
    });
});
