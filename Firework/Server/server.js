"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerFirework = void 0;
const Http = require("http");
const Url = require("url");
const Mongo = require("mongodb");
var ServerFirework;
(function (ServerFirework) {
    let firecrackers;
    let port = process.env.PORT;
    if (port == undefined)
        port = 5001;
    let databaseURL = "mongodb+srv://MyMongoDBUser:abc123abc123@cluster0.bscp6.mongodb.net/Endabgabe?retryWrites=true&w=majority";
    startServer(port);
    connectToDatabase(databaseURL);
    function startServer(_port) {
        let server = Http.createServer();
        console.log("Server starting on: " + _port);
        server.listen(_port);
        server.addListener("request", handleRequest);
    }
    async function connectToDatabase(_url) {
        let options = { useNewUrlParser: true, useUnifiedTopology: true };
        let mongoClient = new Mongo.MongoClient(_url, options);
        await mongoClient.connect();
        firecrackers = mongoClient.db("Endabgabe").collection("Firecrackers");
    }
    async function handleRequest(_request, _response) {
        _response.setHeader("Access-Control-Allow-Origin", "*");
        _response.setHeader("content-type", "text/html; charset=utf-8");
        if (_request.url) {
            let url = Url.parse(_request.url, true);
            let path = url.pathname;
            if (path == "/save") {
                storeFirecracker(url);
                _response.end();
            }
            else if (path == "/getAll") {
                let firecrackersArray = await firecrackers.find({}).toArray();
                _response.write(JSON.stringify(firecrackersArray));
                _response.end();
            }
        }
    }
    async function storeFirecracker(_url) {
        let firecrackerItem = await firecrackers.findOne({ firecrackerId: _url.query.firecrackerId });
        if (firecrackerItem != null)
            firecrackers.updateOne({ firecrackerId: _url.query.firecrackerId }, { $set: { firecrackerId: _url.query.firecrackerId,
                    color1: _url.query.color1, color2: _url.query.color2, particles: _url.query.particles, radius: _url.query.radius } });
        else
            firecrackers.insertOne({ firecrackerId: _url.query.firecrackerId,
                color1: _url.query.color1, color2: _url.query.color2, particles: _url.query.particles, radius: _url.query.radius });
    }
})(ServerFirework = exports.ServerFirework || (exports.ServerFirework = {}));
//# sourceMappingURL=server.js.map