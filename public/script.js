async function register(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const re_password = document.getElementById("re-password").value;
    const message = document.getElementById("message");

    const recaptchaToken = grecaptcha.getResponse();

    if (password !== re_password) {
        message.innerText = "Passwords do not match!";
        message.style.display = "block";
        return;
    }

    if (!recaptchaToken) {
        message.innerText = "Please complete the reCAPTCHA.";
        message.style.color = "red";
        message.style.display = "block";
        return;
    }

    fetch("/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, recaptchaToken }),
    })
        .then(async (response) => {
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "An error occurred.");
            }
            return response.json();
        })
        .then((data) => {
            document.getElementById("registerContainer").style.display = "none";

            document.getElementById("loginContainer").style.display = "block";

            const successMessage = document.getElementById("successMessage");
            successMessage.innerText =
                "Registration successful! Please log in.";
            successMessage.style.color = "green";
            successMessage.style.display = "block";
            grecaptcha.reset();
        })
        .catch((error) => {
            message.innerText = error.message;
            message.style.color = "red";
            message.style.display = "block";
            grecaptcha.reset();
        });
}

async function login(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    const recaptchaToken = grecaptcha.getResponse();

    if (!recaptchaToken) {
        message.innerText = "Please complete the reCAPTCHA.";
        message.style.color = "red";
        message.style.display = "block";
        return;
    }

    fetch("/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, recaptchaToken }),
    })
        .then(async (response) => {
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "An error occurred.");
            }
            return response.json();
        })
        .then((data) => {
            localStorage.setItem("authToken", data.data.token);
            window.location.href = "./panel.html";
        })
        .catch((error) => {
            message.innerText = error.message;
            message.style.color = "red";
            message.style.display = "block";
            grecaptcha.reset();
        });
}

async function forgotPassword(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const recaptchaToken = grecaptcha.getResponse();
    const message = document.getElementById("message");

    if (!recaptchaToken) {
        message.innerText = "Please complete the reCAPTCHA.";
        message.style.color = "red";
        message.style.display = "block";
        return;
    }

    fetch("/api/auth/forget-password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, recaptchaToken }),
    })
        .then(async (response) => {
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "An error occurred.");
            }
            message.innerText = data.message;
            message.style.color = "green";
            message.style.display = "block";
            grecaptcha.reset();
        })
        .catch((error) => {
            message.innerText = error.message;
            message.style.color = "red";
            message.style.display = "block";
            grecaptcha.reset();
        });
}

function resetPassword(event) {
    event.preventDefault();

    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const message = document.getElementById("message");

    if (newPassword !== confirmPassword) {
        message.innerText = "Passwords do not match!";
        message.style.color = "red";
        message.style.display = "block";
        return;
    }

    const token = getQueryParameter("token");

    if (!token) {
        message.innerText = "Invalid or missing token.";
        message.style.color = "red";
        message.style.display = "block";
        return;
    }

    fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
    })
        .then(async (response) => {
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "An error occurred.");
            }
            document.getElementById("resetContainer").style.display = "none";

            document.getElementById("loginContainer").style.display = "block";

            const successMessage = document.getElementById("successMessage");
            successMessage.innerText = "Password updated! Please log in.";
            successMessage.style.color = "green";
            successMessage.style.display = "block";
        })
        .catch((error) => {
            message.innerText = error.message;
            message.style.color = "red";
            message.style.display = "block";
        });
}

async function logout() {
    const token = localStorage.getItem("authToken");
    fetch("/api/user/logout", {
        method: "GET",
        headers: {
            "x-auth-token": token,
        },
    })
        .then((response) => response.json())
        .then((res) => {
            localStorage.removeItem("authToken");
            window.location.href = "./login.html";
        })
        .catch((error) => {
            console.log("Error while logging out:", error);
        });
}

function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}
