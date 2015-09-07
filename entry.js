import "./style.sass";
import "bootstrap/dist/css/bootstrap.min.css";

import $ from "jquery/dist/jquery.min.js";
window.jQuery = $;
import InertiaObject from "./src/InertiaObject";
import polyffil from "babel/polyfill";
import FieldInterference from "./src/FieldInterference";
import GateInterference from "./src/GateInterference";
import SelectRect from "./src/SelectRect";
import CardStore from "./src/CardStore";
import Card from "./src/Card";
import Connector from "hacku-client";
import io from "socket.io-client";
let Modal = require("bootstrap");

$(() => {
    let client = new Connector(io(':3000'));
    let errorHandle = error => {
        console.warn(error);
    };
    // test code
    window.createroom = () => client.createRoom().then(data => {
        console.log("CreateRoom ID", data, "MySocketId", client.socketId);
    }, errorHandle);

    window.join = (num) => client.joinClient(num).then(data => {
        console.log("CreateRoom ID", data);
    }, errorHandle);

    window.getclientlist = () => client.getClientList().then(data => {
        console.log(client.socketId, data);
    }, errorHandle);

    window.client = client;
    window.card = Card;

    let welcomModal = $('#welcome');
    welcomModal.modal('show');
    $(".join-player").click(e => {
        welcomModal.modal("hide");
        let roomid = $(".player-room-id").val();
        client.joinClient(+roomid).then(data => {
            console.log("CreateRoom ID", data);
        }, errorHandle);
    });
    $(".join-master").click(e => {
        welcomModal.modal("hide");
        let joinModal = $('#create-room');
        joinModal.modal("show");
        client.createRoom().then(data => {
            $(".room-id").text(data);
            console.log("CreateRoom ID", data, "MySocketId", client.socketId);
            // todo remove
            client.appendCard([new Card(1, 1, "http://shiv3.ga:8000/uploads/D_3_1441571521324_02.png", "http://shiv3.ga:8000/uploads/back.png")]);
        }, errorHandle);
    });

    let addCustomCard = $("#addCustomCard");
    $(".add-custom").click(e => {
        addCustomCard.modal("show");
    });
    window.uploadcomlite = (d, base) => {
        let filePath = d.file.name;
        let fullPath = base + "file?id=" +filePath;
        client.appendCard([new Card((new Date).getTime(), 0, fullPath, "asset/back.png", client.socketId)]);
    };


    let addCard = $('#addCard');
    $(".add-card").click(e => {
        addCard.modal("show");
        let cardList = $(".cardlist");
        cardList.empty();
        let urlBase = "http://shiv3.ga:8000";
        $.get(urlBase + "/json/index.json", data => {
            data.map((row, i) => {
                $.get(`${urlBase}/${row.card_data_path}`, cardData => {
                    let html = $(`<div><h4>${row.card_list_name}</h4><div class="row"></div><button type="button" class="btn btn-default btn-block" data-id="${i}">このカードを追加</button></div>`);
                    html.find("button").click((e)=> {
                        addCard.modal("hide");
                        var shuffle = function() {return Math.random()-.5};
                        client.appendCard(cardData.sort(shuffle).map(Card.fromObject).map(c => {
                            c.img = urlBase + c.img;
                            c.gmi = urlBase + c.gmi;
                            c.attr.reverse = true;
                            return c;
                        }));
                        return false;
                    });
                    let list = cardData.slice(0,4).map( c => {
                        let img = $(`<div class="col-xs-3"><img class="img-responsive"></div>`)
                            .find("img")
                                .attr("src", urlBase + c.img)
                            .end();
                        html.find(".row").append(img);
                    });
                    cardList.append(html);
                }, "json");
            });
        }, "json");
    });

    $(".reset-table").click(e => {
        $("#reset").modal("show");
    });
    $(".do-reset").click(e => {
        client.removeCard(client.cardList);
    });


    var field = $(".field");

    var fieldInterference = new FieldInterference(field); // 壁にぶつかる
    var gateInterference = new GateInterference(field, $(".player-maker"), ".side"); // PlayerMakerに反応させる
    var intList = [fieldInterference, gateInterference];

    // カード生成
    for(var a in " ".repeat(0)){
        new InertiaObject($("<div class='card'>").appendTo(".card-list")).setInterferences(intList);
    }

    let store = new CardStore($(".card-list"), $(".field"), intList, client);

    // 選択範囲
    new SelectRect(field, $(".selector"), store);
});
