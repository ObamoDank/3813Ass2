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

  joinRoom(room){
    this.socket.emit("joinRoom", room);
    console.log('sent');
  }
  
  newMessage(messageObj) {
    this.socket.emit('message', messageObj);
  }

  getMessage(next){
    this.socket.on('message', (messageObj)=>next(messageObj));
  }


}
