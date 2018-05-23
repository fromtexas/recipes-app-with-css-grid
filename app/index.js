import '../assets/styles/index.scss';

import {elements, renderLoader, clearLoader} from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';

import Search from './models/Search';
import Recipe from './models/Recipe';

//global state of the app
const state = {};


//search controller

const controlSearch = async () => {
    //1. get query of view
    const query = searchView.getInput();
    
    if (query) {

        //2. new search obj and add it to state
        state.search = new Search (query);
        //3. prepare ui for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        //4. search for recepis
        await state.search.getResults();

        clearLoader();
        //5. render results on ui
        searchView.renderResults(state.search.result);

    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    e.preventDefault();
    const btn = e.target.closest('.btn-inline');
    if(btn){
        const goToPage = parseInt(btn.dataset.goto);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

//recipe controller
const controlRecipe = async () => {
    //get d from url
    const id = window.location.hash.replace('#', '');
    if(id){
        //prepare ui to changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        if(state.search){
            searchView.hightlightSelected(id);
        }
        
        //create new recipe obj
        state.recipe = new Recipe(id);

        try{
            //get recipe data
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            //calc serv and calc time
            state.recipe.calcServings();
            state.recipe.calcTime();
            //render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
            //console.log(state.recipe);
        } catch(error){
            console.log(error);
        }
        
    }
};


['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));