import * as Http from "http";
import * as Url from "url";
import * as Mongo from "mongodb";

export namespace ServerFirework {
    let firecrackers: Mongo.Collection;

    let port: number | string | undefined = process.env.PORT;
    if (port == undefined)
        port = 5001;

    let databaseURL: string =  "mongodb+srv://MyMongoDBUser:abc123abc123@cluster0.bscp6.mongodb.net/Endabgabe?retryWrites=true&w=majority";

    startServer(port);
    connectToDatabase(databaseURL); 

    function startServer(_port: number | string): void {
        let server: Http.Server = Http.createServer();
        console.log("Server starting on: " + _port);

        server.listen(_port);
        server.addListener("request", handleRequest);
    }

    async function connectToDatabase(_url: string): Promise<void> {
        let options: Mongo.MongoClientOptions = {useNewUrlParser: true, useUnifiedTopology: true};
        let mongoClient: Mongo.MongoClient = new Mongo.MongoClient(_url, options);
        await mongoClient.connect();
        firecrackers = mongoClient.db("Endabgabe").collection("Firecrackers"); 
    }


    async function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): Promise<void> {
        _response.setHeader("Access-Control-Allow-Origin", "*");
        _response.setHeader("content-type", "text/html; charset=utf-8");
        
        if (_request.url) {
            let url: Url.UrlWithParsedQuery = Url.parse(_request.url, true);
            let path: string | null = url.pathname;
            if (path == "/save") {
                storeFirecracker(url);
                _response.end();
            }
            else if (path == "/getAll") {
                
                let firecrackersArray: string[] = await firecrackers.find({}).toArray();
                _response.write(JSON.stringify(firecrackersArray));
                _response.end();
            }
        }  
    } 
    async function storeFirecracker(_url: Url.UrlWithParsedQuery): Promise<void> {
        let firecrackerItem: string[] | null = await firecrackers.findOne({firecrackerId: _url.query.firecrackerId});
        if (firecrackerItem != null)
            firecrackers.updateOne({firecrackerId: _url.query.firecrackerId}, { $set: {firecrackerId: _url.query.firecrackerId, 
               color1 : _url.query.color1, color2: _url.query.color2, particles: _url.query.particles, radius: _url.query.radius}});
        else
            firecrackers.insertOne({firecrackerId: _url.query.firecrackerId, 
                color1 : _url.query.color1, color2: _url.query.color2, particles: _url.query.particles, radius: _url.query.radius}); 
    }
}