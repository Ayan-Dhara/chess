"use strict"
import path from 'path';
import Express, {response} from 'express';
import ExpressWS from 'express-ws';

import socketHandler from "./handler/SocketHandler.js";
import sha256 from "sha256";

const app = Express();
ExpressWS(app)

app.use(Express.static('client/build'));

app.ws('/ws/*', function(socket, req) {
  socketHandler(socket, req)
})

app.ws('*', function(socket, req) {})

app.get("/room", (req, res) => {
  res.redirect("/")
})

app.post("/room", (req, res) => {
  const room = sha256("Room_" + Date.now() + "." + process.hrtime()[1])
  res.send(JSON.stringify({room}))
})

app.get("*", (request, response) => {
  response.sendFile(path.join(path.resolve(), 'client/build/index.html'));
});

app.listen(process.env.PORT || 5000, () => console.log("Server Started"));
