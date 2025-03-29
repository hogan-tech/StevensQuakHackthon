$(function () {
    $("#loginForm").on("submit", function (e) {
        e.preventDefault();
        const userName = $("#username").val().trim();
        const password = $("#password").val().trim();

        axios
            .post("http://localhost:3000/users/login", {
                userName,
                password,
            })
            .then(function (res) {
                localStorage.setItem("loggedInUser", JSON.stringify(res.data));
                $("#message").text("登入成功，導向中...").css("color", "green");
                setTimeout(function () {
                    window.location.href =
                        "file:///Users/weitingkuo/Documents/QuackHack/StevensQuakHackthon/prototype.html";
                }, 1000);
            })
            .catch(function (err) {
                const msg = err.response?.data?.error || "登入失敗";
                $("#message").text(msg).css("color", "red");
            });
    });
});
