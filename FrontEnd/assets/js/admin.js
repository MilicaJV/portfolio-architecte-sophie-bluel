function toggleAdminElements() {
    const adminElements = document.querySelectorAll(".admin-element");
    const token = localStorage.getItem("token");
    if (token) {
        adminElements.forEach(item => {
            if (item.classList.contains("hidden")) {
                item.classList.remove("hidden")
            } else {
                item.classList.add("hidden")
            }
        })
    }
}
toggleAdminElements();


const logout = document.querySelector(".logout");
logout.addEventListener("click", function () {
    localStorage.removeItem("token");
    window.location.href = "index.html";
});

const openModal = document.querySelector(".openModal");
const modal = document.getElementById("modal1");
const secondModal = document.getElementById("modal2")
const closeModal = document.getElementById("closeModal1");

if (openModal && modal && closeModal) {
    openModal.addEventListener("click", (e) => {
        e.preventDefault();
        modal.classList.remove("hidden");

    }
    )
};


function closeModals() {
    document.querySelectorAll(".close").forEach(button => {
        button.addEventListener("click", (e) => {
            const modalToClose = button.closest(".modal");
            if (modalToClose) {
                modalToClose.style.display = "none";
            }
        });
    });
    document.querySelectorAll(".modal").forEach(modal => {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });
    });
    document.getElementById("arrowBack").addEventListener("click", (e) => {
        secondModal.classList.add("hidden");
        modal.modal.style.display = "none";
    })
}
closeModals();


function openSecondModal() {
    const openModal2 = document.getElementById("addPhotoBtn");
    const secondModal = document.querySelector(".secondModal");
    openModal2.addEventListener("click", function () {
        modal.classList.add("hidden");
        secondModal.classList.remove("hidden");
    });
};
openSecondModal();

const select = document.getElementById("category");
async function loadCategories() {
    try {
        const response = await fetch("http://localhost:5678/api/categories");
        const categories = await response.json();
        categories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.id;
            option.textContent = cat.name;
            select.appendChild(option);
        });

    } catch (error) {
        console.error("Erreur lors du chargement des catégories :", error);
    }
}
loadCategories();


function preview(file) {
    if (file && file.type.startsWith("image/")) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
            const image = document.getElementById("imgPreview");
            image.src = reader.result;
            image.style.height = "169px";
            image.style.objectFit = "cover";
        }
    }
};
document.getElementById("photoInput").addEventListener("change", function () {
    preview(this.files[0]);
    document.querySelector(".icon-preview").classList.add("hidden");
    document.querySelector(".btn-upload").classList.add("hidden");
    document.querySelector(".photoSize").classList.add("hidden");
    document.querySelector(".btn-submit").disabled = false;

});

function addNewProject() {
    const form = document.querySelector(".photoForm");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fileInput = document.getElementById("photoInput");
        const title = form.querySelector('input[name="title"]').value;
        const category = document.getElementById("category").value;
        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append("image", file);
        formData.append("title", title);
        formData.append("category", category);
        try {
            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                body: formData,
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            });
            if (response.ok) {
                displayProjects()
                displayProjectsInModal()
                form.reset();
                document.getElementById("imgPreview").src = "";
                document.querySelector(".icon-preview").classList.remove("hidden");
                document.querySelector(".btn-upload").classList.remove("hidden");
                document.querySelector(".photoSize").classList.remove("hidden");
                document.getElementById("modal2").classList.add("hidden");
            } else {
                alert("Erreur lors de l'ajout de la photo.");
            }
        } catch (error) {
            console.error("Erreur :", error);
            alert("Impossible d'envoyer la photo.");
        }
    });
};
addNewProject();
