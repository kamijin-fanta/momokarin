export default class {
    constructor(id, cardset, img, gmi, owner, attr) {
        this.ID = id;
        this.cardsetID = cardset;
        this.img = img;
        this.gmi = gmi;
        this.owner = owner;
        this.attr = attr;
    }
    static fromObject(obj){
        let card = new Card();
        for(var name in obj){
            if(!(name in card)) console.warn(`Unknown Key"${name}"`, obj);
            card[name] = obj[name];
        }
        return card;
    }
    getId(){
        return `${this.cardsetID}/${this.ID}`
    }
}