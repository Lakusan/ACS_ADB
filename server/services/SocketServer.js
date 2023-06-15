const { Server } = require('socket.io');
const EventEmitter = require('events');

// handles socket connections
// allows only uniq sockerIds to prevent multiple connections
// singleton
// Events: disconnected, user connected, socket: message received, user disconnected
// state machine

class SocketServer extends EventEmitter {

    static getInstance() {
        if(!SocketServer.instance){
            SocketServer.instance = new SocketServer();
        }
        return SocketServer.instance;
    }

    constructor(){
        super(); 
        this.io = null;
        this.state = 'disconnected';
        this.connectedUsers = new Map();
    }

    initialize(server){
        if (this.state === 'disconnected') {
            this.io = new Server(server, {
                cors: {
                    origin: '*',
                    methods: ["GET", "POST"]
                }
            });
                
            this.io.on('connection', (socket) => {
                socket.on('join', (userId) => {
                    if (this.connectedUsers.has(userId)) {
                        socket.emit('error', `User with id: ${userId} already connected`);
                        socket.disconnect(true);
                    } else {
                        this.connectedUsers.set(userId, socket.id);
                         this.emit('user connected', userId);
                    }
                    
                });
                
                socket.on('message', (userId, message) => {
                    if(this.connectedUsers.get(userId) === socket.id){
                        this.emit('socket: data', userId);
                    } else {
                        socket.emit('error', 'Unauthorized');
                    }
                });

                socket.on('disconnect', () => {
                    const disconnectedUser = [...this.connectedUsers.entries()].find(
                        ([_,sockerId]) => sockerId === sockerId
                    );

                    if (disconnectedUser){
                        const [userId] = disconnectedUser;
                         this.connectedUsers.delete(userId);
                        this.emit('user disconnected', userId);
                    }
                });
            });

            this.state = 'connected';
            this.emit('connected');
        }
    }

    getUserSocketId(userId) {
        return this.connectedUsers.get(userId);
    }

    disconnect(){
        if(this.state === 'connected'){
            this.io.close();
            this.io = null;
            this.connectedUsers.clear();
            this.state = 'disconnected';
            this.emit('disconnected');
        }
    }
}

module.exports = SocketServer;