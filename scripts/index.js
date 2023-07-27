import { addWork, deleteWork } from "./store.js";

// CREATION D'UN ELEMENT HTML
function createElement(tagName, classes = []) {
  const element = document.createElement(tagName);
  if (classes.length > 0) {
    element.classList.add(...classes); // ... spread opérator, décompose le tableau en liste d'éléments individuels
  }
  return element;
}

// AFFICHAGE DE LA GALERIE
export function displayGallery(worksSent) {
  document.querySelector(".gallery").innerHTML = "";
  // parcours des travaux récupérés dans l'API et création des cartes associées
  for (let i in worksSent) {
    let workSenti = worksSent[i];
    const workCard = createElement("figure");

    // affichage de l'image
    const workImg = createElement("img", ["cardImg"]);
    workCard.appendChild(workImg);
    workImg.setAttribute("crossorigin", "anonymous");
    workImg.src = workSenti.imageUrl;

    // affichage du titre de l'image
    const workTitle = createElement("figcaption", ["cardfigcaption"]);
    workCard.appendChild(workTitle);
    workTitle.innerText = workSenti.title;

    // ajout de l'élément workcard à l'élément parent gallery
    document.querySelector(".gallery").appendChild(workCard);
  }
}


// AFFICHAGE DES FILTRES
export function displayFilters(works, categories) {
  // réinitialisation des boutons de filtres
  document.querySelector(".btn").innerHTML = "";
  // conteneur filtres rattaché au portfolio
  const portfolio = document.getElementById("portfolio");
  const filtersContainer = createElement("div", ["filters"]);
  const ngallery = document.getElementsByClassName("gallery")[0];
  portfolio.insertBefore(filtersContainer, ngallery);

  // ajout du bouton "Tous"
  const btnAll = createElement("button", ["btn", "SelectedFilter"]);
  btnAll.setAttribute("id", "IdBtnAll");
  btnAll.innerText = "Tous";
  filtersContainer.appendChild(btnAll);
  btnAll.addEventListener("click", function () {
    displayGallery(works);
    updateFilterBtn(btnAll);
  })

  // affichage des boutons de filtre
  for (let categoryName of categories) {
    const catButton = createElement("button", ["btn"]);
    catButton.innerText = categoryName.name;
    filtersContainer.appendChild(catButton);

    // événement d'écoute sur chacun des boutons filtres
    catButton.addEventListener("click", function () {
      const FilteredWorks = works.filter(work => work.category.name == categoryName.name);
      displayGallery(FilteredWorks);
      updateFilterBtn(catButton);
    });
  }
}

// MISE A JOUR DE L'APPARENCE DES BOUTONS FILTRES
export function updateFilterBtn(filterBtn) {
  const filters = document.getElementsByClassName("btn");
  for (let i = 0; i < filters.length; i++) {
    filters[i].classList.remove("SelectedFilter");
  }
  filterBtn.classList.add("SelectedFilter");
}

// AFFICHAGE QUAND CONNECTÉ
export function showWhenConnected(worksFetched, categoriesFetched) {
  // Affichage de l'état de l'authentification (login/logout) dans la barre de navigation
  const listeLi = document.querySelector("ul");
  const loginLi = listeLi.querySelectorAll("li")[2];
  if (sessionStorage.getItem("access_token") != null) {
    loginLi.innerText = "logout";
    loginLi.style.cursor = "pointer";
    loginLi.addEventListener("click", function () {
      sessionStorage.clear();
      document.location.reload();
    })
  }
  // Barre des filtres cachée
  if ((worksFetched !== []) && (categoriesFetched !== [])) {
    const filters = document.getElementsByClassName("filters");
    filters[0].style.display = "none";
    // Affichage du bandeau noir
    const headBand = document.getElementsByClassName("divheadband");
    headBand[0].style.display = null;
    //remplissage modale
    fillModal(worksFetched, categoriesFetched);
  }
  // Ecoute sur liens vers l'ouverture de la modale
  document.querySelectorAll(".js-modal").forEach(a => {
    a.style.display = null;
    a.removeEventListener("click", openModal);
    a.addEventListener("click", openModal);
  })
}

// REMPLISSAGE DE LA MODALE
export function displayThumbnailsGallery(worksSent) {
  // galerie de thumbnails
  for (let i in worksSent) {
    let workSenti = worksSent[i];
    const workCard = createElement("figure");
    workCard.classList.add("workCard");
    document.querySelector(".idPhotosGallery").appendChild(workCard);

    // affichage de chaque image
    const workImg = createElement("img", ["cardImg"]);
    workImg.setAttribute("crossorigin", "anonymous");
    workImg.src = workSenti.imageUrl;
    workCard.appendChild(workImg);

    // affichage du titre de l'image
    const workTitle = createElement("figcaption");
    workTitle.innerText = "éditer";
    workTitle.style.color = "#000000";
    workCard.appendChild(workTitle);

    // affichage de la poubelle sur chacune des images
    const trashImg = createElement("i", ["idDivTrash"]);
    trashImg.classList.add("fa-solid", "fa-trash-can");

    // si clic sur la poubelle 
    trashImg.addEventListener("click", function (e) {
      e.preventDefault();
      workCard.style.display = "none";
      document.querySelector("#errorApiMsg").style.display = null;
      deleteWork(workSenti.id, worksSent);
    })
    workCard.appendChild(trashImg);
  }
}

function fillModal(worksSent, categories) {
  document.querySelector(".idPhotosGallery").innerHTML = "";
  // titre de la modale
  document.querySelector("#modalTitle").innerText = "Galerie photos";

  // seule l'icône de fermeture apparait et se loge à droite
  document.querySelector("#idBack").style.display = "none";
  document.querySelector("#divIcones").style.justifyContent = "right";

  // si appui sur icône de retour
  const back = document.querySelector("#idBack");
  back.addEventListener("click", returnBack);
  function returnBack(e) {
    e.preventDefault();
    document.querySelector("#addPhotoForm").reset();
    document.querySelector("#idBack").style.display = "none";
    document.querySelector("#divIcones").style.justifyContent = "right";
    document.querySelector("#addPhotoForm").style.display = "none";
    document.querySelector(".idPhotosGallery").style.display = null;
    document.querySelector("#idAddPhotoBtn").style.display = null;
    document.querySelector("#idDeleteGallery").style.display = null;
    document.querySelector("#addTitleMsg").style.display = "none";
    document.querySelector("#addPhotoMsg").style.display = "none";
    document.querySelector("#errorApiMsg").style.display = "none";
    document.querySelector("#modalTitle").innerText = "Galerie photos";
    document.getElementById("line1").style.display = null;
    back.addEventListener("click", returnBack);
    AddPhotoBtn.addEventListener("click", openAddPhotoForm);
  }
  // affichage de la galerie de la modale
  displayThumbnailsGallery(worksSent);

  // affichage de l'icône de déplacement sur la 1ère photo lorsque la galerie n'est pas vide !
  if (worksSent.length !== 0) {
    const card = document.querySelectorAll(".workCard");
    const movingImg = createElement("i", ["idDivMoving"]);
    movingImg.classList.add("fa-solid", "fa-arrows-up-down-left-right");
    card[0].appendChild(movingImg);
  }

  // bouton ouvrant le formulaire "ajout de photos"
  const AddPhotoBtn = document.querySelector("#idAddPhotoBtn");
  AddPhotoBtn.addEventListener("click", openAddPhotoForm);

  // partie "ajout photo" de la modale
  function openAddPhotoForm(e) {
    e.preventDefault();
    AddPhotoBtn.removeEventListener("click", openAddPhotoForm);
    // affichage du formulaire
    document.querySelector("#addPhotoForm").reset();
    document.querySelector("#thumbnail").style.display = "none";
    document.querySelector("#divImportPhoto").style.display = null;
    document.querySelector("#miniPhoto").style.display = null;
    document.querySelector("#miniPhoto").src = "";
    document.querySelector("#workAddPhotoInput").innerHTML = "";
    document.querySelector("#thumbnail").src = "";
    document.querySelector("#modalTitle").innerText = "Ajout photo";
    document.querySelector(".idPhotosGallery").style.display = "none";
    document.querySelector("#idAddPhotoBtn").style.display = "none";
    document.querySelector("#idDeleteGallery").style.display = "none";
    document.querySelector("#addPhotoForm").style.display = null;
    document.querySelector("#addPhotoSubmitBtn").style.backgroundColor = "#a7a7a7";
    document.querySelector("#idBack").style.display = null;
    document.querySelector("#divIcones").style.justifyContent = "space-between";
    document.getElementById("line1").style.display = "none";
    document.querySelector("#addTitleMsg").style.display = "none";
    document.querySelector("#errorApiMsg").style.display = "none";

    //  chargement du thumbnail
    const loadPhotoBtn = document.getElementById("workAddPhotoInput");
    loadPhotoBtn.addEventListener("change", loadPhotoFile);
    function loadPhotoFile(e) {
      e.preventDefault();
      let file = null;
      file = e.target.files[0];
      document.querySelector("#addPhotoMsg").innerText = "jpg, png : 4mo max";
      document.querySelector("#addPhotoMsg").style.color = "";
      // vérification de la taille de la photo
      if (file.size <= 4 * 1024 * 1024) {
        document.querySelector("#thumbnail").style.display = null;
        const inputPhoto = document.getElementById("miniPhoto");
        inputPhoto.style.display = "";
        inputPhoto.src = URL.createObjectURL(file);
        const divImportPhoto = document.querySelector("#divImportPhoto");
        divImportPhoto.style.display = "none";
        document.querySelector("#addPhotoMsg").style.display = "none";
        // couleur verte du bouton de validation
        const inputPhotoBtn = document.querySelector("#workAddPhotoInput");
        if (inputPhotoBtn.files[0] !== undefined
          && (idTitleAddPhoto.value.length !== 0 || idTitleAddPhoto.value.trim() !== '')) {
          document.querySelector("#addPhotoSubmitBtn").style.backgroundColor = "#1D6154";
        }
        loadPhotoBtn.removeEventListener("change", loadPhotoFile);
        loadPhotoBtn.addEventListener("change", loadPhotoFile);
      } else {
        console.log('Le fichier est supérieur à 4 Mo');
        file = null;
        loadPhotoBtn.removeEventListener("change", loadPhotoFile);
        loadPhotoBtn.addEventListener("change", loadPhotoFile);
      }
    }
    AddPhotoBtn.addEventListener("click", openAddPhotoForm);
  }

  // remplissage de la liste déroulante des catégories
  const selectCategories = document.querySelector("#photoCategories");
  for (let category of categories) {
    let catOption = createElement("option", ["photoCategory"]);
    catOption.innerText = category.name;
    catOption.setAttribute("id", parseInt(category.id))
    selectCategories.appendChild(catOption);
  }

  // couleur du bouton de validation
  const idTitleAddPhoto = document.querySelector("#idTitleAddPhoto");
  idTitleAddPhoto.addEventListener("input", function (event) {
    event.preventDefault();
    const inputPhotoBtn = document.querySelector("#workAddPhotoInput");
    if (inputPhotoBtn.files[0] !== undefined
      && (idTitleAddPhoto.value.length !== 0 || idTitleAddPhoto.value.trim() !== '')) {
      document.querySelector("#addPhotoSubmitBtn").style.backgroundColor = "#1D6154";
    }
    idTitleAddPhoto.removeEventListener('input', function (event) { });
  });

  // validation du formulaire d'ajout de photo
  const addPhotoForm = document.querySelector("#addPhotoForm");
  addPhotoForm.addEventListener("submit", function (e) {
    e.preventDefault();
    // Vérifie si la photo est ajoutée
    const inputPhotoBtn = document.querySelector("#workAddPhotoInput");
    if (inputPhotoBtn.files[0] === undefined) {
      document.querySelector("#addPhotoMsg").style.display = null;
      document.querySelector("#addPhotoMsg").innerText = 'Veuillez ajouter une photo svp';
      return;
    }
    // Vérifie si le titre est ajouté
    const idTitleAddPhoto = document.querySelector("#idTitleAddPhoto");
    if (idTitleAddPhoto.value.length === 0 || idTitleAddPhoto.value.trim() === '') {
      document.querySelector("#addTitleMsg").style.display = null;
      document.querySelector("#addTitleMsg").innerText = 'Veuillez renseigner le titre svp';
      idTitleAddPhoto.focus();
      return;
    }

    // Appel à l'api
    addWork(worksSent, categories);
    addPhotoForm.removeEventListener('submit', function (e) { })
    addPhotoForm.addEventListener('submit', function (e) { })
  })

  // suppression de la galerie
  const deleteGallery = document.querySelector("#idDeleteGallery");
  deleteGallery.addEventListener("click", function (e) {
    e.preventDefault();
    if (confirm("Voulez-vous vraiment supprimer l'ensemble de la galerie?")) {
      for (let j in worksSent) {
        deleteWork(parseInt(worksSent[j].id), worksSent);
      }
      worksSent = [];
      document.querySelector("#modalTitle").innerText = 'La galerie est vide';
      updateWorks();
      document.querySelector(".gallery").innerHTML = "";
      document.querySelector("#idDeleteGallery").style.display = "none";
      document.querySelector(".filters").style.display = "none";
    }
  })
}
// mise à jour de l'ajout ou de la suppression de travaux
export function updateWorks(worksSent) {
  if (typeof worksSent !== "undefined") {
    document.querySelector(".idPhotosGallery").innerHTML = "";
    displayThumbnailsGallery(worksSent);
  }
  else {
    document.querySelector(".idPhotosGallery").innerHTML = "";
  }
}
//--------------------------------------------------------------------
// AFFICHAGE DE LA MODALE
let modal = null;
// ouverture de la fenêtre modale
const openModal = function (e) {
  e.preventDefault();
  modal = document.querySelector(e.target.getAttribute("href"));
  modal.style.display = null;
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");
  modal.addEventListener("click", closeModal);
  modal.querySelector("#idClose").addEventListener("click", closeModal);
  modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
  document.querySelectorAll(".js-modal").forEach(a => {
    a.style.display = null;
    a.removeEventListener("click", openModal);
    a.addEventListener("click", openModal);
  })
  modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);
}
// fermeture de la fenêtre modale
const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();
  modal.querySelector("#addPhotoForm").reset();
  const back = document.querySelector("#idBack");
  back.click();
  document.querySelectorAll(".js-modal").forEach(a => {
    a.removeEventListener("click", openModal);
    a.addEventListener("click", openModal);
  })
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal.querySelector("#idClose").removeEventListener("click", closeModal);
  modal.querySelector("#idAddPhotoBtn").removeEventListener("click", closeModal);
  modal.querySelector(".js-modal-close").removeEventListener("click", closeModal);
  modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);
  modal.querySelector("#idClose").addEventListener("click", closeModal);
  modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);
  modal = null;
}
// empêche la propagation de l'événement vers les parents
const stopPropagation = function (e) {
  e.stopPropagation();
}