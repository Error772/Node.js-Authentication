async function register(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const re_password = document.getElementById("re-password").value;
    if (password !== re_password) {
        alert("passwords not match!");
        return;
    }
    fetch("/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
        })
        .catch((error) => {
            console.log("Error fetching fake identity:", error);
        });
}

async function login(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const res = await response.json();

        console.log(res);

        if (!response.ok) {
            throw new Error(res.message || "Login failed");
        }

        localStorage.setItem("authToken", res.data.token);
        window.location.href = "./panel.html";
    } catch (error) {
        errorMessage.textContent = error.message;
        errorMessage.style.display = "block";
    }
}
