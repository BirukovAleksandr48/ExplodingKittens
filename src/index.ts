import * as express from 'express';
import * as http from 'http';
import socketServer from './socketServer';

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

socketServer(server);
server.listen(3000, () => {
    console.log('listening on *:3000');
});
