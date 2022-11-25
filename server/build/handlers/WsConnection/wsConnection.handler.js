"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsConnectionHandler = void 0;
const index_1 = require("../../index");
function wsConnectionHandler(ws, req) {
    ws.onmessage = msg => {
        const message = JSON.parse(msg.data);
        switch (message.method) {
            case 'connection':
                connectionHandler(ws, message);
                break;
        }
    };
}
exports.wsConnectionHandler = wsConnectionHandler;
function connectionHandler(ws, message) {
    ws.id = message.id;
    broadcastConnection(ws, message);
}
function broadcastConnection(ws, message) {
    index_1.aWss.clients.forEach((client) => {
        if (client.id === message.id) {
            client.send(`Пользователь ${message.username} подключился`);
        }
    });
}
