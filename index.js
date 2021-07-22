"use strict"
import path from 'path';
import Express, {response} from 'express';
import ExpressWS from 'express-ws';
import sha256 from 'sha256';
import * as fs from "fs";

import {messageHandler, rooms} from "./handler/RoomHandler.js";
import {KEYWORDS} from "./client/src/KeyWords.js";

const app = Express();
ExpressWS(app)

app.use(Express.static('client/build'));

app.ws('/ws/*', function(socket, req) {
  let path = req.params[0]
  if(! rooms[path]) {
    let room = {}
    room.viewers = []
    room.moves = []
    room.lastTurn = false
    room.ownersTurn = true
    rooms[path] = room
  }
  socket.send(JSON.stringify(
    {
      type: KEYWORDS.STATUS,
      status: "connected"
    }
  ))
  socket.path = path
  socket.addEventListener("message", messageHandler)
})

app.ws('*', function(socket, req) {
  console.log(socket)
})

app.get("*", (request, response) => {
  response.sendFile(path.join(path.resolve(), 'client/build/index.html'));
});

app.listen(process.env.PORT || 5000, () => console.log("Server Started"));
