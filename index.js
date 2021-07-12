"use strict"
import path from 'path';
import Express, {response} from 'express';
import ExpressWS from 'express-ws';
import sha256 from 'sha256';

const app = Express();
ExpressWS(app)

app.use(Express.static('client/build'));

app.get("/", (req, res) => {
  res.sendFile(path.join(path.resolve(), 'client/build/index.html'));
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(path.resolve(), 'client/build/index.html'));
});

app.listen(process.env.PORT || 5000, () => console.log("Server Started"));
