import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config';
import recipieView from './views/recipieView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipieView from './views/addRecipieView.js';

//scripts
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODAL_CLOSE_SEC } from './config.js';
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function (e) {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipieView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1) Loading recipe
    await model.loadRecpie(id);

    // 2) Rendering recipe
    recipieView.render(model.state.recipe);

    // update bookmarks view
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipieView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Get seatch quert
    const query = searchView.getQuery();
    if (!query) return;

    //2) Load seartch result
    await model.loadSearchResults(query);

    // 3) render results
    // console.log(model.state.search.results);
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttos
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = goToPage => {
  //1) render new results

  resultsView.render(model.getSearchResultsPage(goToPage));

  // 4) Render new pagination buttos
  paginationView.render(model.state.search);
};

const controlServings = newServings => {
  // Update the recipie servings (in state)
  model.updateServings(newServings);

  // Update the recipie view

  // recipieView.render(model.state.recipe);
  recipieView.update(model.state.recipe);
};

const controlAddBookmark = () => {
  // Add/remoce the bookmar
  if (!model.state.recipe.bookmarks) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // Update recpie view
  recipieView.update(model.state.recipe);
  // Render bookmarsks

  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = () => {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipie = async newRecipie => {
  try {
    addRecipieView.renderSpinner();

    await model.uploadRecipe(newRecipie);
    console.log(model.state.recipe);

    recipieView.render(model.state.recipe);

    // succes message
    addRecipieView.renderMessage();

    //render bookmark bview
    bookmarksView.render(model.state.bookmarks);

    //change id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // window.history.back();

    // close modal window
    setTimeout(() => {
      addRecipieView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipieView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipieView.addHandlerRender(controlRecipes);
  recipieView.addHandlerUpdateServings(controlServings);
  recipieView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipieView.addHandlerUpload(controlAddRecipie);
};
init();
