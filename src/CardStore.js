import $ from "jquery/dist/jquery.min.js";
import InertiaObject from "./InertiaObject";
import FieldInterference from "./FieldInterference";
import GateInterference from "./GateInterference";
import Card from "./Card";
let debug = require("debug")("CardStore");
debug = () => {};

export default class{
    constructor(cardListElement, field, interferences, client) {
        this.cardObjects = [];
        this.cardVirtualObjects = [];
        this.cardListElement = cardListElement;
        this.field = field;
        this.interferences = interferences.map(i => (i.store=this)&&i);
        this.ownerId = "owner";
        this.client = client;
        this.isTable = false;

        this.cardObjects = [];
        this.refresh();

        this.client.onChange = c => {
            this.cardObjects = c.cardList;
            this.ownerId = c.socketId;
            this.isTable = c.isMaster;

            let tip = $(".tool-tip").removeClass(["is-master", "is-player"]);
            if(this.isTable) tip.addClass("is-master");
            else tip.addClass("is-player");

            // maker

            let marker = $(".player-maker");
            marker.empty();
            if(this.isTable) {
                let makerList = [
                    "p1 top",
                    "p2 bottom",
                    "p3 left",
                    "p4 right",
                    "p5 top",
                    "p6 bottom"
                ];
                c.getPlayerList().forEach((e, i) => {
                    marker.append(`<div data-owner="${e.id}" data-isplayer="${e.id!==c.masterId}" class="side ${makerList[i]}"><div class="tip"></div></div>`);
                });
            } else {
                marker.append(`<div data-owner="${c.masterId}" data-isplayer="false" class="side top p${c.getMyPlayerNumber()+1}"><div class="tip"></div></div>`);
            }
            this.refresh();
        };
        this.client.emit();
    }
    refresh(){
        let alreadyList = [];
        let appendList = [];
        for(let cardRow in this.cardObjects){
            let card = this.cardObjects[cardRow];
            let virtualMatch = this.cardVirtualObjects.findIndex(e => card.hash() === e.card.hash());
            let isOwn = card.owner === this.ownerId || (this.isTable && !card.owner);
            if(virtualMatch != -1 && isOwn){
                // found
                let virtual = this.cardVirtualObjects[virtualMatch];
                this.cardVirtualObjects[virtualMatch].card = card;
                debug("Match", card, virtual);
                alreadyList.push(virtualMatch);
            } else if(isOwn) {
                // not found
                appendList.push(card);
            }
        }
        let removeList = this.cardVirtualObjects.filter((e,i)=> !alreadyList.some(d => i == d));
        this.appendElement(appendList);
        this.removeElement(removeList);
        debug("Append", appendList, "RemoveList", removeList, "CardObjects", this.cardObjects, "Virtual", this.cardVirtualObjects);
    }

    appendElement(list){
        list.forEach(card => {
            let element = $("<div class='card'><div class='img'></div></div>"); // <img class='img'><img class='gmi'>

            this.cardListElement.append(element);
            let object = new InertiaObject(element).setInterferences(this.interferences);

            object.card = card;
            this.cardVirtualObjects.push(object);
        });
    }
    removeElement(list){
        let rmVirtual = (target) => this.cardVirtualObjects.some((v, i) => {
            if (v==target) this.cardVirtualObjects.splice(i,1);
        });
        list.forEach(object => {
            object.kill();
            rmVirtual(object);
        });
    }

    setCard(replace){
        this.client.modifyCard(replace);
        return ;
        for(let cardRow in this.cardObjects){
            let card = this.cardObjects[cardRow];
            if(card.hash()  === replace.hash()){
                this.cardObjects[cardRow] = replace;
                debug("Replace Card", replace);
                // todo emit change
                this.refresh();
                return;
            }
        }
        debug("Warn!! ", replace);
        this.refresh();
    }
}