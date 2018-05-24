import '../assets/styles/index.scss';

import {elements, renderLoader, clearLoader} from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';

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


//list controller
const controlList = () => {
    if(!state.list){
        state.list = new List();

        state.recipe.ingredients.forEach(item => {
            const el = state.list.addItem(item.count, item.unit, item.ingredient);
            listView.renderItem(el);
        });
    }
};

//update and delete list items
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        state.list.deleteItem(id);
        listView.deleteItem(id);
    }
    else if(e.target.matches('.shopping__count-value, .shopping__count-value *')){
        const val = parseFloat(e.target.value);
        state.list.updateCount(id, val);
    }
    
});


elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    }
    else if(e.target.matches('.btn-increase, .btn-increase *')){
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } 
    else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        controlList();
    }
    //console.log(state.recipe);
});

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));



