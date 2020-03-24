import { Component, OnInit, ViewChild ,Output, EventEmitter} from '@angular/core';
import { SetupService } from '../../services/setup.service';
//import { InventoryService } from '../../services/inventory.service';
import { Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
 
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})


export class SidenavComponent implements OnInit {

  @Output() eventClicked = new EventEmitter<Event>();
  constructor(private spinnerService: Ng4LoadingSpinnerService,private setupService: SetupService, private route:Router) { }

    dropdownIndex: any;
    allCategories=[];
    allSubCategories=[];
    Industries = [];
    subCatArray = [];
    IndustriesData = [];
    industryName=String;
    valueIndustry: { industryId: any; };
    valueCategory: { categoryId: any; };
    showNav:boolean;
    subcat=[];
  ngOnInit() {
    this.spinnerService.show()
    this.setupService.getCategoryList().subscribe(res=>{ this.allCategories=res; })
    this.setupService.getSubCategoryList().subscribe(res=>{ this.allSubCategories=res; })
    this.setupService.getIndustry().subscribe(res =>{
        let unsortedInd=res.splice(0,12);
        this.Industries = unsortedInd.sort(
          function(a, b){
                var nameA=String(a.name.toLowerCase()), nameB=String(b.name.toLowerCase())
                if (nameA < nameB)
                    return -1
                if (nameA > nameB)
                    return 1
                return 0;
            }
        )
        this.spinnerService.hide()
    });
  }

  clickCategoryList(data,catSubCat):void{
    this.eventClicked.emit(data);
    let id=String(data._id);
    let pathstring="/b2b-store/categoryListing"
    this.route.navigate(['/b2b-store/categoryListing',{id}]);
    this.leavingmouse(catSubCat);
  }
  clicksubCategoryList(data){
    let id=data._id;
    this.route.navigate(['/b2b-store/subCategoryListing',{id}]);
  }

   overMouseEvent(industry,catSubCat,industriesBtn){

      let toShow = catSubCat;
      this.IndustriesData = [];
      var tempArr = [];
      this.subCatArray = [];
      this.subcat = [];
      toShow.style.display = 'block';
      this.allCategories.forEach(category =>{
        if(category.industryId._id === industry._id){
          tempArr.push(category);
          this.showsubcategory(category);
        }
      })
      this.IndustriesData=tempArr;
  }

    leavingmouse(catSubCat){
      let tohide = catSubCat;
      tohide.style.display = 'none';
    }

    public showsubcategory(data){
      var tempsubcatArr = [];
      this.allSubCategories.forEach(subcategory =>{
        if(subcategory.categoryId._id === data._id){
          tempsubcatArr.push(subcategory);
        }
      })

      let spliced=tempsubcatArr.splice(0,4).sort(
        function(a, b){
              var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
              if (nameA < nameB)
                  return -1
              if (nameA > nameB)
                  return 1
              return 0;
          }
      )
      this.subCatArray.push(spliced)

    }
}
