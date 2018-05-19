import '../assets/styles/index.scss';

import {elements} from './views/base';
import * as searchView from './views/searchView';

import Search from './models/Search';

//global state of the app
const state = {};

const controlSearch = async () => {
    //1. get query of view
    const query = searchView.getInput();
    
    if (query) {

        //2. new search obj and add it to state
        state.search = new Search (query);

        //3. prepare ui for results
        searchView.clearInput();
        searchView.clearResults();

        //4. search for recepis
        await state.search.getResults();

        //5. render results on ui
        searchView.renderResults(state.search.result);

    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

