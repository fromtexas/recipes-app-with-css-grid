import axios from 'axios';
import {key, proxy} from '../config';

//search list model

export default class Search {
    constructor (querry) {
        this.querry = querry
    }

    async getResults () {

        try{
            const result = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.querry}`);
            this.result =  result.data.recipes;
            //console.log(this.result);
        } catch (error){
            console.log(error);  
        } 
    }
}