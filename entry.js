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
    let client = new Connector(io('http://localhost:3000'));
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
        }, errorHandle);
    });

    var field = $(".field");

    var fieldInterference = new FieldInterference(field); // 壁にぶつかる
    var gateInterference = new GateInterference(field, $(".player-maker .side")); // PlayerMakerに反応させる
    var intList = [fieldInterference, gateInterference];

    // カード生成
    for(var a in " ".repeat(0)){
        new InertiaObject($("<div class='card'>").appendTo(".card-list")).setInterferences(intList);
    }

    // 選択範囲
    new SelectRect(field, $(".selector"));

    new CardStore($(".card-list"), $(".field"), intList, client);
});
