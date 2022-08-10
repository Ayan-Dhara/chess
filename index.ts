import './configure'
import path from 'path';
import Express from 'express';
import ExpressWS from 'express-ws';

import socketHandler from "./socket";
import sha256 from "sha256";

const app = Express();
const socketApp = ExpressWS(app).app

socketApp.ws('*', function (socket, req) {
  socketHandler(socket)
})

socketApp.use(Express.static('build'));


// socketApp.get("/room", (req, res) => {
//   res.redirect("/")
// })

socketApp.post("/create", (req, res) => {
  const room = sha256("Room_" + Date.now() + "." + process.hrtime()[1])
  res.send(JSON.stringify({room}))
})

socketApp.get("*", (request, response) => {
  // response.send("Hello from Express!");
  response.sendFile(path.join(path.resolve(), 'build/index.html'));
});

socketApp.listen(process.env.SERVER_PORT || 5000, () => console.log("Server Started"));
