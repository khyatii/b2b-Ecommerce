import { Component, OnInit, HostListener, ViewChild, EventEmitter } from '@angular/core';
import { SetupService } from '../../services/setup.service';
import { InventoryService } from '../../services/inventory.service';
import { Router } from '@angular/router';
import { CommonService } from '../commonService/common.service';
import { UserService } from '../../services/user.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  outputs:[`childEvent`],
})

export class HeaderComponent implements OnInit {
  dropdownIndex: any;
  showMenu: boolean;
  @ViewChild('listmenu') menu;
  constructor(private setupService: SetupService, private inventoryService: InventoryService,
  private route:Router, public commonService:CommonService, private user:UserService) { }
  productarr;
  searchResults;
  allSubCategories;
  clickflag=false;
  categoryhoverResults=[]; 
  catName;
  childEvent = new EventEmitter<any>();
  token = localStorage.getItem('token')
  isUser = false;
  userDetails ;

  ngOnInit() {
    if(this.token){
      this.user.getUser().subscribe(resp=>{
        this.isUser = true;
        this.userDetails = resp["doc"][0];
      },err=>{
        this.isUser = false;
      })
    }
  }

  categoryhover(productId,subcats,name){
    this.inventoryService.categorySearch({productId}).subscribe( doc=>{
      if(doc.length < 0){
      }else{
        this.catName=name
        this.categoryhoverResults = doc;
        subcats.style.display='block';
      }
    });
  }
  leavingcategory(subcats){
    subcats.style.display='none';
  }
  clickSearchbox(eve){
    this.clickflag=true;
    if(this.clickflag && eve.target.value.length <= 0 ){
      //code for situations when click on input and empty for recent searches
    }
  }

  searchproduct(eve, ele){
    var searchTerm = String( eve.target.value );
    if( searchTerm.length < 1 ){
      this.searchResults = [];
    }else if(searchTerm !== undefined){
      this.inventoryService.getSearchResults({searchTerm}).subscribe( doc=>{
         this.searchResults= doc
      });
    }
  }

  //for searching products on the basis of subcategory
  clickonsubcat(subcategoryId){
    this.route.navigate(['/b2b-store/search-results',subcategoryId]);
    // this.childEvent.emit(subcategoryId)
    // this.commonService.setState(subcategoryId);
  }
  clickonCategory(categoryId){
    //this.route.navigate(['/b2b-store/search-results',subcategoryId]);
    this.route.navigate(['/b2b-store/categoryListing',categoryId])
  }

  //searching products on the basis of string in input box
  searchString(str){
    var query={searchq:str}
    if(query.searchq==''){
      this.route.navigate(['/b2b-store'])
    }else{
      this.route.navigate(['/b2b-store/search-string',query]);
    }
  }

  logoutUser(){
    localStorage.clear();
    this.ngOnInit();
  }

  dashboardRedirect(){
    this.route.navigate(['/app/seller-layout'])
  }


}
