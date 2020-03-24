import { VasSelectionService } from './../../services/vas-selection.service';
import { Component, OnInit, state } from '@angular/core';

@Component({
  selector: 'app-subscribe-vas',
  templateUrl: './subscribe-vas.component.html',
  styleUrls: ['./subscribe-vas.component.css']
})
export class SubscribeVasComponent implements OnInit {

  public isHide: boolean = false;
  vasArray = [];
  status = 'subscribe';
  successMsg: string;
  isSuccess: boolean = true;
  errorMsg: string;
  isError: boolean = true;
  isLoading: boolean = false;

  constructor(private vasSelectionService: VasSelectionService) { }

  ngOnInit() {
    this.vasSelectionService.getVasSubscribeService().subscribe(
      res => {
        this.vasArray = res;
      }
    )

    // this.vasSelectionService.getAllVas().subscribe(
    //   res=>{
    //     this.vasArray = res;
    //   }
    // )
  }

  // showsubscribe(s,u){
  //   s.classList.remove('hide');
  //   u.classList.add('hide');
  // }

  // showunsubscribe(s,u){
  //   u.classList.remove('hide');
  //   s.classList.add('hide');
  // }

  changeService(x) {
    this.isLoading = true;
    let array = { vasServiceId: '', status: '', };
    array.vasServiceId = x._id;
    if (x.vas.length > 0) {
      if (x.vas['0'].status == 'subscribe') {
        array.status = 'unsubscribe';
      }
      else {
        array.status = 'subscribe';
      }
    }
    else {
      array.status = 'subscribe';
    }

    this.vasSelectionService.postVasSubscibeService(array).subscribe(
      res => {
        // return status = 'unsubscribe';
        this.successMsg = "Status is changed.";
        this.showSuccess();
        this.isLoading = false;
        this.ngOnInit();
      }, err => {
        this.errorMsg = "Some Error Occured";
        this.showError();
        this.isLoading = false;
      }
    )
  }

  showSuccess() {
    window.scrollTo(500, 0);
    this.isSuccess = false;
    setTimeout(() => {
      this.isSuccess = true;
    }, 2000);
  }

  showError() {
    window.scrollTo(500, 0);
    this.isError = false;
    setTimeout(() => {
      this.isError = true;
    }, 2000);
  }

}
