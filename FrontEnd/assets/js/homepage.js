async function getProjects() {
    const projects = await fetch("http://localhost:5678/api/works");
    const projectsJson = await projects.json();
    console.log(projectsJson);
    return projectsJson
}


async function displayProjects() {
    const projects = await getProjects();
    const projectsContent = document.querySelector("#portfolio .gallery");
    projectsContent.innerHTML = "";
    for (let project of projects) {
        const figureElement = document.createElement("figure");
        figureElement.classList.add("photo");
        figureElement.dataset.category = project["categoryId"];
        figureElement.dataset.id = project["id"];
        const imgElement = document.createElement("img");
        imgElement.setAttribute("src", project["imageUrl"]);
        imgElement.setAttribute("alt", project["title"]);
        const figcaptionElement = document.createElement("figcaption");
        const text = document.createTextNode(project["title"]);
        figcaptionElement.appendChild(text);
        figureElement.appendChild(imgElement);
        figureElement.appendChild(figcaptionElement);
        projectsContent.appendChild(figureElement);
    }

}
displayProjects();

async function getCategories() {
    const categories = await fetch("http://localhost:5678/api/categories");
    const categoriesJson = await categories.json();
    return categoriesJson;
}

function removeDuplicates(data) {
    data = [...new Set(data)];
    let allCat = { id: 0, name: "Tous" };
    data.unshift(allCat);
    return data;

}

async function displayCategories() {
    let categories = await getCategories();
    categories = removeDuplicates(categories);
    categories.forEach(cat => {
        const btn = document.createElement("button");
        btn.textContent = cat["name"];
        btn.dataset.filter = cat["id"];
        btn.classList.add("btn-filter");
        filters.appendChild(btn);
    });
    filterCategories();
};

const filters = document.querySelector(".filters");
const token = localStorage.getItem("token");
if (token) {
    filters.style.display = "none";
} else {
    displayCategories()
};

async function filterCategories() {
    const filterButtons = document.querySelectorAll(".btn-filter");
    const items = document.querySelectorAll("figure.photo");
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const filter = button.dataset.filter;
            items.forEach(item => {
                if (filter == 0 || item.dataset.category === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    })
};


async function displayProjectsInModal() {
    const projects = await getProjects();
    const divImages = document.querySelector(".images");
    divImages.innerHTML = "";
    projects.forEach((project) => {
        const tagFigure = document.createElement("figure");
        tagFigure.dataset.id = project["id"];
        const tagImg = document.createElement("img");
        const trash = document.createElement("span");
        trash.classList.add("trash-icon");
        trash.dataset.id = project["id"];
        const trashIcon = document.createElement("i");
        trashIcon.classList.add("fa-solid", "fa-trash-can");
        trash.appendChild(trashIcon);
        tagFigure.appendChild(trash);
        tagImg.setAttribute("src", project["imageUrl"]);
        tagImg.setAttribute("alt", project["title"]);
        tagImg.style.height = "102px";
        tagImg.style.objectFit = "cover";
        tagFigure.appendChild(tagImg);
        divImages.appendChild(tagFigure);
        trash.addEventListener("click", async function (event) {
            removeProject(project["id"])
        });
    });
};
displayProjectsInModal();


async function removeProject(id) {
    try {
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token"),
                "Content-type": "application/json"
            }
        });
        if (response.ok) {
            displayProjects();
            displayProjectsInModal()
        } else {
            alert("Erreur lors de la suppression !");
        }
    } catch (error) {
        console.log("Erreur :", error);
        alert("Impossible de supprimer l'image.");
    }

};
