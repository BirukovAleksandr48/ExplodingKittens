import * as uuid from 'uuid';
import * as _ from 'lodash';

class Socket  {

    public rooms: string[];
    public sendToRooms: string[] = [];
    public actionHandlers = {};
    public actions: Array<{actionName: string, payload: any}> = [];
    public socketApp: SocketApp;
    public id: string;

    constructor (socketApp: SocketApp, id?: string) {
        this.id = id || uuid();
        this.rooms = [this.id];
        this.socketApp = socketApp;
    }

    public clone () {
        const result = new Socket(this.socketApp, this.id);
        result.rooms = [...this.rooms];
        result.sendToRooms = [...this.sendToRooms];
        result.actionHandlers = { ...this.actionHandlers };
        result.actions = [...this.actions];
        return result;
    }

    public join (roomName) {
        this.rooms.push(roomName);
    }

    public leave (roomName) {
        _.remove(this.rooms, r => r === roomName);
    }

    public to (roomName) {
        const result = this.clone();
        result.sendToRooms = [...result.sendToRooms, roomName];
        return result;
    }

    public emit (actionName, payload) {
        if (this.sendToRooms.length) {
            this.socketApp.emit(actionName, payload, this.sendToRooms, this.id);
        } else {
            this.socketApp.emit(actionName, payload, [this.id]);
        }
    }

    public on (actionName, callback) {
        this.actionHandlers[actionName] = callback;
    }

    public say (actionName, payload) {
        this.actions.push({ actionName, payload });
        if (this.actionHandlers[actionName]) {
            this.actionHandlers[actionName](payload);
        } else {
            console.warn(`${actionName} hasn't callback function`);
        }
    }

}

// tslint:disable-next-line:max-classes-per-file
class SocketApp {

    public sockets: { sockets: { [p: string]: Socket } } = {
        sockets: { },
    };
    public sendToRooms: string[] = [];

    public clone () {
        const result = new SocketApp();
        result.sockets = { ...this.sockets };
        result.sendToRooms = [...this.sendToRooms];
        return result;
    }

    public createSocket (id?: string) {
        const socket = new Socket(this, id);
        this.sockets.sockets[socket.id] = socket;
        return socket;
    }

    public emit (actionName, payload, rooms?, executorId?) {
        if (this.sendToRooms.length) {
            _.map(this.sockets.sockets, socket => {
                if (socket.rooms.find(roomName => this.sendToRooms.some(name => name === roomName))) {
                    socket.say(actionName, payload);
                }
            });
        } else if (rooms.length) {
            _.map(this.sockets.sockets, socket => {
                if (socket.id !== executorId &&
                    socket.rooms.find(roomName => rooms.some(name => name === roomName))) {

                    socket.say(actionName, payload);
                }
            });
        }
    }

    public to (roomName) {
        const result = this.clone();
        result.sendToRooms = [...this.sendToRooms, roomName];
        return result;
    }
}

export {
    SocketApp,
    Socket,
};
