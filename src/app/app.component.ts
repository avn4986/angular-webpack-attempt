import {Component} from '@angular/core';

@Component({
  selector: 'angular-application',
  template: '<h1 id="dummy-text">Hello world......!</h1>',
  styleUrls: ['./app.styles.css']
})
export class AppComponent {

  constructor() {
    console.log("I am Angular, or am I?")
  }
}