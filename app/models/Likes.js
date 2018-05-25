
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
        return like;
    }

    deleteLike(id){
        const index = this.likes.findIndex(item => item.id === id);
        this.likes.splice(index, 1);
    }

    isLiked (id) {
        return this.likes.find(item => item.id === id);
    }

    getNumLikes () {
        return this.likes.length;
    }
}