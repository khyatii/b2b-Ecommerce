import { Component, OnInit } from '@angular/core';
import { SetupService } from '../../services/setup.service';
@Component({
  selector: 'app-show-all-industries',
  templateUrl: './show-all-industries.component.html',
  styleUrls: ['./show-all-industries.component.scss']
})
export class ShowAllIndustriesComponent implements OnInit {

  constructor(private setupService: SetupService) { }
  industries: Array<any> = [];
  categories:Array<any>=[];
  itemCount = 0;
  ngOnInit() {
    this.setupService.getIndustry().subscribe(res => {
      console.log('response of industriws is ', res);
      this.industries = res.sort(
        function (a, b) {
          var nameA = String(a.name.toLowerCase()), nameB = String(b.name.toLowerCase())
          if (nameA < nameB)
            return -1
          if (nameA > nameB)
            return 1
          return 0;
        }
      )
    });

    this.setupService.getCategoryList().subscribe(res=>{ 
      this.categories=res; 
      console.log('all categories are', res); 
    })
  }

  isToshow(industry, category, ind){
    if(industry._id == category.industryId._id){
      if(ind == this.categories.length-1){
        this.itemCount = 0;
      }else{
        this.itemCount ++;
        if(this.itemCount > 4){
          return false;
        }else{
          return true;
        }
      }
    }else{
      return false;
    }
  }
}

