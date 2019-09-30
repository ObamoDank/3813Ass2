import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
const SERVER_URL = 'http://localhost:3000';


@Injectable({
  providedIn: 'root'
})
export class SocketsService {
  private socket;
  constructor() { }
  initSocket(){
    this.socket = io(SERVER_URL);
}

}
