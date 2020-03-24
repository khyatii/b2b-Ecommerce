import { Component, OnInit, ViewEncapsulation, NgZone, } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, } from '@angular/forms';
import { Router } from '@angular/router';
import { InputOutputService } from '../../services/inputOutput.service';
import { SetupService } from '../../services/setup.service';
import { AppError } from "../../apperrors/apperror";

@Component({
  selector: 'app-price-list',
  templateUrl: './price-list.component.html',
  styleUrls: ['./price-list.component.scss']
})
export class PriceListComponent implements OnInit {
  array: Array<number> = [];
  fileName: string = "Select file to Upload";
  successMsg: string;
  isSuccess: boolean = true;
  errorMsg: string;
  isError: boolean = true;

  priceListArray: Array<object>
  constructor(private fb: FormBuilder, private route: Router, private zone: NgZone, private inputOutputService: InputOutputService,
    private setupService: SetupService) { }

  ngOnInit() {
    this.setupService.getPriceList().subscribe(
      res => {
        this.array = res
      },
      err => {
        this.errorMsg = "Some Error Occured";
        this.showError();
        if (err instanceof AppError) {

        }
      }
    )
  }

  addProduct() {
    this.route.navigate(['/app/inventory/addProduct'])

  }

  fileChoose(file) {
    file.click();
  }

  triggerFile(ref) {
    ref.click();
  }

  fileChange(ref) {
    this.fileName = ref.files["0"].name;
  }

  upload(importFile) {

    // let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#photo');
    let inputEl: HTMLInputElement = importFile
    let fileCount: number = inputEl.files.length;
    // this.fileUploaded = new FormData();
    // if (fileCount > 0) {         
    // this.fileUploaded.append('photo', inputEl.files.item(0));
    // this.inventoryService.postImportDoc(this.traderId,this.fileUploaded).subscribe(
    // 	res=>{
    // 	alert('Success')
    // 	},err=>{
    // 	alert('Error')
    // 	}
    // )
    // }
    // else{
    // this.fileUploaded = null;
    // }
  }

  closePopUp(event) {
    document.getElementById('modalAddPriceList').style.display = 'none';
  }

  deletePriceList(id) {
    this.setupService.modifyPriceList(id).subscribe(
      res => {
        this.successMsg = "Price List is modified.";
        this.showSuccess();
      },
      err => {
        this.errorMsg = "Some Error Occured";
        this.showError();
        if (err instanceof AppError) {

        }
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

  formatDate(temp) {
    let Fulldate = new Date(temp);
    let month = Fulldate.getMonth() + 1;
    let date = Fulldate.getDate();
    let year = Fulldate.getFullYear();
    return month + "/" + date + "/" + year;
  }

  modify(objData) {
    let id = objData._id;
    this.route.navigate(['/app/setup/modifypricelist', { id }]);

  }

}
