import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

const BACKEND_URL = "http://localhost:3000";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username = "";
  password = "";
  access = false;
  errorMsg: String;

  constructor(private router: Router, private http: HttpClient) { }


  // Function provides user access to dashboard component
  login() {
    let userObj = { 
      username: this.username,
      password: this.password
    };

    this.http.post<any>(BACKEND_URL + "/checkUser", userObj).subscribe((data) => {
      if (data.pass) {
        this.access = true;
        localStorage.setItem("username", this.username);
        this.router.navigateByUrl("/dash")
      } else if(data.exists){
        this.errorMsg = "Your Password is Bad, try again";
      } else{
        this.errorMsg = "Nah mate you aren't real";
      }
    })
  }



  ngOnInit() {
  }

}
