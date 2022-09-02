import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Bill-splittor';
  loggedInUser;

  constructor() {}
  ngOnInit(): void {
    this.loggedInUser = JSON.parse(localStorage.getItem('user'));
  }
}
