import { getCategories, getWorks } from "./api.js";

const projets = document.querySelector("#projets");
projets.addEventListener("click", showModale);

const modaleBg = document.querySelector(".modale-bg");
modaleBg.addEventListener("click", hideModale);

const addPictureButton = document.getElementById("addPicture");
addPictureButton.addEventListener("click", addPicture);

const modale = document.querySelector(".modale");
const modale2 = document.querySelector(".modale2");

// Empêcher la fermeture des modales au clic à l'intérieur
modale.addEventListener("click", clickModale);
modale2.addEventListener("click", clickModale); // Ajouté ici pour modale2

// Initialiser la modale

async function addPicture() {
  modale.style.display = "none"; // Ferme modale 1
  modale2.style.display = "flex"; // Ouvre modale 2
  await sendWork();
}

function clickModale(event) {
  event.stopPropagation(); // Empêche la propagation des clics à modaleBg
}

function hideModale() {
  modaleBg.style.display = "none"; // Ferme le fond
  modale.style.display = "none"; // Ferme modale 1
  modale2.style.display = "none"; // Ferme modale 2
}

function showModale() {
  modaleBg.style.display = "flex"; // Affiche le fond
  modale.style.display = "flex"; // Affiche modale 1
}

let SELECTED_CATEGORY = "";

const workGallery = document.getElementById("work-gallery-in-modale");
await displayWorksInModale();

  async function displayCategoriesInModale() {
    try {
      const categories = await getCategories();

      // Ajoute les catégories
      categories.forEach((category) => {
        //Ajout des categories dans le formulaire d'ajout
        const categorySelect = document.querySelector("#categorie-select")
        console.log(categorySelect)
        const newOption = document.createElement("option")
        newOption.value = category.id
        newOption.text = category.name
        categorySelect.appendChild(newOption)
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories :", error);
    }
  }

    displayCategoriesInModale();



// Affiche les travaux dans la galerie
async function displayWorksInModale() {
  const works = await getWorks();
  workGallery.innerHTML = "";
  works
    .filter(
      (work) =>
        SELECTED_CATEGORY === "" || work.category.name === SELECTED_CATEGORY
    )
    .forEach((work) => {
      const figure = document.createElement("figure");
      figure.className = "figure-modale";

      const img = document.createElement("img");
      img.className = "image-modale";
      img.src = work.imageUrl;
      img.alt = work.title;

      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-bouton";
      deleteButton.id = work.id + "-delete-bouton";
      deleteButton.setAttribute("data-id", work.id)

      workGallery.appendChild(figure);
      figure.appendChild(img);
      figure.appendChild(deleteButton);

    });
    addDeleteButton()
}

/****************** FERMER MODALE 1 ********************/
const closeModale = document.querySelector(".fa-xmark");
closeModale.addEventListener("click", () => {
  modale.style.display = "none";
  modaleBg.style.display = "none";
});

/****************** FERMER MODALE 2 ********************/

const closeModale2 = document.getElementById("close-modale");
closeModale2.addEventListener("click", () => {
  modale2.style.display = "none";
  modaleBg.style.display = "none";
});

/******************* BOUTON RETOUR *******************/

const retourModale1 = document.getElementById("retour-modale1");
retourModale1.addEventListener("click", () => {
  modale2.style.display = "none";
  modale.style.display = "flex";
});

/******************* EFFACER IMAGE *******************/

function addDeleteButton () {
  const buttons = document.querySelectorAll(".delete-bouton");

  const authToken = sessionStorage.getItem("authToken");
  if (!authToken) {
    console.log("Vous devez être connecté pour supprimer une image !");

    buttons.forEach((button) => {
      button.style.display = "none";
    });

    return;
  }

  buttons.forEach((buttonContainer) => {

    const deleteIcon = document.createElement("i");
    deleteIcon.className = "delete-icon fa-solid fa-trash-can";

    buttonContainer.appendChild(deleteIcon);

    deleteIcon.addEventListener("click", async (event) => {
        event.preventDefault();

      const imageId = buttonContainer.getAttribute("data-id");
      const API_URL = `http://localhost:5678/api/works/${imageId}`;

      try {
        const response = await fetch(API_URL, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.ok) {
          buttonContainer.parentElement.remove();
          alert(" Image supprimée avec succès !");
        } else {
          const errorMessage = await response.text();
          alert(`Erreur ${response.status} : ${errorMessage}`);
        }
      } catch (error) {
        alert("Erreur réseau :", error);
      }
    });
  });
}

/******************* AJOUTER IMAGE *******************/

async function sendWork() {
  const fileInput = document.getElementById("file-input");
  const validateButton = document.getElementById("addPicture2");
  const workGallery = document.getElementById("work-gallery-in-modale");

  validateButton.addEventListener("click", async () => {
    const file = fileInput.files[0];
    const title = document.querySelector("#titre").value;
    const category = document.querySelector("#categorie-select").value;

    const authToken = sessionStorage.getItem("authToken");
    if (!authToken) {
      alert("Vous devez être connecté pour ajouter une image !");
      return;
    }

    if (!file || !title || !category) {
      alert("Veuillez remplir tous les champs et sélectionner un fichier.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner un fichier image valide.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("category", category);

    validateButton.disabled = true;
    validateButton.textContent = "Envoi en cours...";

    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erreur du serveur :", errorText);
        if (response.status === 401) {
          alert("Erreur d'authentification. Veuillez vous reconnecter.");
        } else if (response.status === 400) {
          alert("Données invalides. Vérifiez les champs.");
        } else {
          alert(`Erreur serveur : ${response.status}`);
        }
        return;
      }

      const newWork = await response.json();
      console.log("Réponse JSON :", newWork);

      const figure = document.createElement("figure");
      const img = document.createElement("img");
      const figcaption = document.createElement("figcaption");

      img.src = `http://localhost:5678${newWork.imageUrl}`;
      img.alt = newWork.title;
      figcaption.textContent = newWork.title;

      figure.appendChild(img);
      figure.appendChild(figcaption);
      workGallery.appendChild(figure);

      alert("Photo ajoutée avec succès !");
      fileInput.value = "";
      document.querySelector("#titre").value = "";
      document.querySelector("#categorie-select").value = "1";
    } catch (error) {
      console.error("Erreur :", error);
      alert(`Une erreur est survenue : ${error.message}`);
    } finally {
      validateButton.disabled = false;
      validateButton.textContent = "Valider";
    }
  });
}