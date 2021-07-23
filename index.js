"use strict"
import path from 'path';
import Express, {response} from 'express';
import ExpressWS from 'express-ws';
import sha256 from 'sha256';
import * as fs from "fs";

import socketHandler from "./handler/socketHandler.js";

const app = Express();
ExpressWS(app)

app.use(Express.static('client/build'));

app.ws('/ws/*', function(socket, req) {
  socketHandler(socket, req)
})

app.ws('*', function(socket, req) {})

app.get("*", (request, response) => {
  response.sendFile(path.join(path.resolve(), 'client/build/index.html'));
});

app.listen(process.env.PORT || 5000, () => console.log("Server Started"));
