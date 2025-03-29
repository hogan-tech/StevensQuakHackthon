$(function () {
    $("#registerForm").on("submit", function (e) {
        e.preventDefault();
        const userName = $("#username").val().trim();
        const password = $("#password").val().trim();

        axios
            .post("http://localhost:3000/users/register", {
                userName,
                password,
            })
            .then(function (res) {
                $("#message").text("註冊成功，導向中...").css("color", "green");
                setTimeout(function () {
                    window.location.href = "/login.html";
                }, 1000);
            })
            .catch(function (err) {
                const msg = err.response?.data?.error || "註冊失敗";
                $("#message").text(msg).css("color", "red");
            });
    });
});
