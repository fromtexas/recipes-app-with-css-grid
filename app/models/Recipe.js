import axios from 'axios';
import {key, proxy} from '../config';

export default class Recipe {
    constructor(id){
        this.id = id;
    }

    async getRecipe () {
        try {
            const res = await axios(`${proxy}http://food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url
            this.ingredients = res.data.recipe.ingredients;
        } catch (error){
            console.log(error);
        }
    }

    calcTime (){
        //15min for each ing
        const numImg = this.ingredients.length;
        const perionds = Math.ceil(numIng / 3);
        this.time = perionds*15;
    }

    calcServings () {
        this.servings = 4;
    }
}