import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sucess-popup',
  templateUrl: './sucess-popup.component.html',
  styleUrls: ['./sucess-popup.component.css']
})
export class SucessPopupComponent implements OnInit {

  successMsg:string = "You Registered Succesfully.";
  isSuccess:boolean = true;
  constructor() { }

  ngOnInit() {
  }

  showSuccess(){
    window.scrollTo(500, 0);
    this.isSuccess =  false;
    setTimeout(() => {
      this.isSuccess = true; 
    }, 2000);
  }

}
