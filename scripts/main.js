import { fetchWorks, fetchCategories } from './store.js';
import { displayGallery, displayFilters, showWhenConnected } from './index.js';


  // AFFICHAGE DU PORTFOLIO
  fetchWorks().then(worksFetched => {
  if (worksFetched !== []) {
    displayGallery(worksFetched);
  } else {
    alert('pas de travaux dans la base de données');
  }

  // AFFICHAGE DES FILTRES
  fetchCategories().then(categoriesFetched => {
    // AFFICHAGE DU PORTFOLIO
    if ((worksFetched !== []) && (categoriesFetched !== [])) {
      displayFilters(worksFetched, categoriesFetched);
      // utilisateur connecté
      if (sessionStorage.getItem("access_token")) {
        showWhenConnected(worksFetched, categoriesFetched);
      }
    } else {
      console.log("pas d'affichage car pas de travaux et de catégories");
      showWhenConnected();
    }
  })
})