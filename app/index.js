import '../assets/styles/index.scss';

import {elements, renderLoader, clearLoader} from './views/base';
import * as searchView from './views/searchView';

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


