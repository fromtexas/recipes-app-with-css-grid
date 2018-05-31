

export default class Likes {
    constructor () {
        this.likes = [];
    }

    addLike (id, title, author, img) {
        const like = {
            id, 
            title, 
            img,
            author
        }
        this.likes.push(like);

        this.persistData();

        return like;
    }

    deleteLike (id){
        const index = this.likes.findIndex(item => item.id === id);
        this.likes.splice(index, 1);

        this.persistData();
    }

    isLiked (id) {
        return this.likes.find(item => item.id === id);
    }

    getNumLikes () {
        return this.likes.length;
    }

    persistData () {
       localStorage.setItem('likes', JSON.stringify(this.likes)); 
    }

    reedStorage () {
        const storage = JSON.parse(localStorage.getItem('likes'));
        if(storage){
            this.likes = storage;
        }
    }
}