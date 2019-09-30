import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
const SERVER_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class ImgUploadServiceService {

  constructor(private http: HttpClient) { }

  imgUpload(fd) {
    return this.http.post<any>(SERVER_URL + '/uploadFile', fd);
  }
}
