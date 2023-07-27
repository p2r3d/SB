import { displayGallery, updateWorks, displayThumbnailsGallery } from './index.js';

const API_URL = "http://localhost:5678/api/";

// Récupération des travaux via l'API
export async function fetchWorks() {
  try {
    const response = await fetch(`${API_URL}works`);
    if (!response.ok) {
      throw new Error(`HTTP erreur ${response.status} !`);
    }
    const works = await response.json();
    return works;
  }
  catch (error) {
    console.error(error);
  }
}

// Récupération des catégories via l'API
export async function fetchCategories() {
  try {
    const response = await fetch(`${API_URL}categories`);
    if (!response.ok) {
      throw new Error(`HTTP erreur ${response.status} !`);
    }
    const categories = await response.json();
    return categories;
  }
  catch (error) {
    console.error(error);
  }
}

// Ajout de travaux 
export async function addWork(works, cat) {
  const token = sessionStorage.getItem("access_token");
  if (sessionStorage.getItem("access_token") != null) {
    
    // Création de l'objet formData
    let formData = new FormData();
    const inputPhotoBtn = document.querySelector("#workAddPhotoInput");
    formData.append("image", inputPhotoBtn.files[0]);
    formData.append("title", document.querySelector("#idTitleAddPhoto").value);
    const opt = document.querySelector("#photoCategories");
    const optId = parseInt(opt.selectedOptions[0].id);
    formData.append("category", parseInt(optId));

    // envoi d'une demande au serveur
    await fetch(`${API_URL}works`, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erreur requête serveur (HTTP ${response.status}) !`);
        }
        // récup du projet ajouté
        return response.json();
      })
      .then(data => {
        // ajout de l'identifiant de la catégorie dans le nouveau projet
        data.category = {};
        data.category = (cat[parseInt(data.categoryId) - 1]);
        data.categoryId = parseInt(data.categoryId);
        works.push(data);
        // Affichage de la galerie
        displayGallery(works);
        //Affichage dans la mini-galerie
        updateWorks(works);
        // retour vers modale  mini-galerie
        const idBack = document.querySelector("#idBack");
        idBack.click();
      })
      .catch((error) => {
        // affichage du message d'erreur
        document.querySelector("#errorApiMsg").style.display = null;
        document.querySelector("#errorApiMsg").innerText = error.message;
      })
  }
}

// Suppression de travaux 
export async function deleteWork(WorkId, works) {
  const token = sessionStorage.getItem("access_token");
  if (sessionStorage.getItem("access_token") == null) { return; }
  
  // envoi d'une demande au serveur
  await fetch(`${API_URL}works/${WorkId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
  })
    .then((response) => {
      if (!response.ok) {
        document.querySelector(".idPhotosGallery").innerHTML = "";
        displayThumbnailsGallery(works);
        throw new Error(`Erreur requête serveur (HTTP ${response.status}) !`);
      }
      // on enlève le work de la liste 
      if (works.length !== 0) {
        let WorkToDelete = works.find(objet => objet.id === WorkId);
        let indexToDelete = works.indexOf(WorkToDelete);
        works.splice(indexToDelete, 1);
        // réaffichage de la galerie avec le tableau des travaux mis à jour
        displayGallery(works);
      }
    })
    .catch((error) => {
      // affichage du message d'erreur
      document.querySelector("#errorApiMsg").style.display = null;
      document.querySelector("#errorApiMsg").innerText = error.message;
    })
}