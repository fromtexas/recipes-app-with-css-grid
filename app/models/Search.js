import axios from 'axios';

export default class Search {
    constructor (querry) {
        this.querry = querry
    }

    async getResults () {
        const key = '5a3172e0314ec52bc81582ccf001ef26';
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        try{
            const result = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.querry}`);
            this.result =  result.data.recipes;
            //console.log(this.result);
        } catch (error){
            console.log(error);  
        } 
    }
}