const form = document.querySelector("form");

form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const username = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "email": username, "password": password })
    })
        .then(response => {
            if (!response.ok) {
                document.querySelector(".error").style.display = "block";
                throw new Error("Erreur de connexion");
            }
            return response.json();
        })

        .then(data => {
            window.localStorage.setItem("token", data.token);
            window.location.href = "index.html";
        })
        .catch(error => {
            console.error("Erreur attrapée : ", error);
        });

});

