import * as model from './model.js';
import recipieView from './views/recipieView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView.js';

//scripts
import 'core-js/stable';
import 'regenerator-runtime/runtime';
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

const init = function () {
  recipieView.addHandlerRender(controlRecipes);
  recipieView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();
