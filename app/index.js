import toastr from 'toastr';
import '../assets/styles/index.scss';

import {elements, renderLoader, clearLoader} from './views/base';

import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';

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

        try {
            //4. search for recepis
            await state.search.getResults();
            clearLoader();
            //5. render results on ui
            if(state.search.result.length === 0) {
                toastr.warning(`${query} recipes not found`);
                clearLoader();
            } else {
                searchView.renderResults(state.search.result);
            }
            
        } 
        catch (error) {
            console.log(error);
            toastr.error('Sorry, no response from API, try again and pray!');
            clearLoader();
        }
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
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(state.recipe.id));
            //console.log(state.recipe);
        } catch(error){
            console.log(error);
            toastr.error('No response from API, pick recipe again!');
            clearLoader();
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
        listView.renderDeleteAllButton();
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
    else if(e.target.matches('.shopping__delete-all, .shopping__delete-all *')){
        state.list.deleteAllItems();
        state.list = '';
        listView.deleteAllItems();
    }
    
});

//likes controller

const controlLikes = () => {
    if(!state.likes){
        state.likes = new Likes();
    }

    if(!state.likes.isLiked(state.recipe.id)){
        const newLike = state.likes.addLike(
            state.recipe.id, 
            state.recipe.title, 
            state.recipe.author, 
            state.recipe.img
        );
        likesView.toggleLikeBtn(state.likes.isLiked(state.recipe.id));
        likesView.renderLike(newLike);
    }
    else{
        state.likes.deleteLike(state.recipe.id);
        likesView.toggleLikeBtn(state.likes.isLiked(state.recipe.id));
        likesView.deleteLike(state.recipe.id);
        //console.log(state.likes);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};


//restoring liked recipes

window.addEventListener('load', () => {
    state.likes = new Likes();
    state.likes.reedStorage();
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    state.likes.likes.forEach(likesView.renderLike);
});


//recipe button clicks
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
    else if(e.target.matches('.recipe__love, .recipe__love *')){
        controlLikes();
    }
    //console.log(state.recipe);
});

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));



