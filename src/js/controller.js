import * as model from './model.js';
import recipieView from './views/recipieView.js';

//scripts
import 'core-js/stable';
import 'regenerator-runtime/runtime';
if (module.hot) {
  module.hot.accept();
}
const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function (e) {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipieView.renderSpinner();

    // 1) Loading recipe
    await model.loadRecpie(id);

    // 2) Rendering recipe
    recipieView.render(model.state.recipe);
  } catch (err) {
    recipieView.renderError();
  }
};

const init = function () {
  recipieView.addHandlerRender(controlRecipes);
};
init();
