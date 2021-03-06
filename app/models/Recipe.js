import axios from 'axios';
import {key, proxy} from '../config';

//choosed recipe model

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
        const perionds = Math.ceil(this.ingredients.length / 3);
        this.time = perionds*15;
    }

    calcServings () {
        this.servings = 4;
    }

    parseIngredients () {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teespoons', 'teespoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map(item => {
            //uniform units
            let ingredient = item.toLowerCase();
            unitsLong.forEach((item, index) => {
                ingredient = ingredient.replace(item, unitsShort[index]);
            });
            //remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
            //parse ingredients to count, unit and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(item => units.includes(item));

            let objIng;
            if(unitIndex > -1){
                const arrCount = arrIng.slice(0, unitIndex);
                let count;
                if(arrCount.length === 1){
                    count = eval(arrIng[0].replace('-', '+'));
                }
                else{
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex+1).join(' ')
                }
            }
            else if(parseInt(arrIng[0])){
                objIng = {
                    count: parseInt(arrIng[0]),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            }
            else if(unitIndex === -1){
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient 
                }
            }
            
            return objIng;
        });
        this.ingredients = newIngredients;
    }

    updateServings (type) {
        //servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        //ingredients
        this.ingredients.forEach(item => {
            item.count = item.count * (newServings / this.servings);
        });

        this.servings = newServings;
    }
}