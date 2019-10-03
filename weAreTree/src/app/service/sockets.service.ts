import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { nextContext } from '@angular/core/src/render3';
const SERVER_URL = 'http://localhost:3000';


@Injectable({
  providedIn: 'root'
})
export class SocketsService {
  private socket;
  constructor() { }

  // Function initialises Sockets
  initSocket() {
    this.socket = io(SERVER_URL);
  }

  // Function emits a user and adds them to a channel
  joinRoom(room, user){
    this.socket.emit("joinRoom", room, user);
    console.log('sent');
  }
  
  // Function emits a message to channel
  newMessage(messageObj, location) {
    this.socket.emit('message', messageObj, location);
  }

  // Function receives message from server
  getMessage(next){
    this.socket.on('message', (messageObj)=>next(messageObj));
  }

  // Function emits a user and removes them from a channel
  leaveRoom(room, user){
    this.socket.emit('leaveRoom', room, user);
  }

  // Function returns a notice from server
  notice(next){
    this.socket.on('notice', (res)=>next(res));
  }

}
