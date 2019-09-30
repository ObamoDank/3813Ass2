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

  initSocket() {
    this.socket = io(SERVER_URL);
  }

  joinRoom(room, user){
    this.socket.emit("joinRoom", room, user);
    console.log('sent');
  }
  
  newMessage(messageObj, location) {
    this.socket.emit('message', messageObj, location);
  }

  getMessage(next){
    this.socket.on('message', (messageObj)=>next(messageObj));
  }

  leaveRoom(room, user){
    this.socket.emit('leaveRoom', room, user);
  }

  notice(next){
    this.socket.on('notice', (res)=>next(res));
  }

}
