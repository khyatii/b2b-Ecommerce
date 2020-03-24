import { Component, OnInit } from '@angular/core';
import { UserLogisticsService } from '../../../services/userLogistics.Service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-service-catalogue',
  templateUrl: './view-service-catalogue.component.html',
  styleUrls: ['./view-service-catalogue.component.css']
})
export class ViewServiceCatalogueComponent implements OnInit {

  constructor(private userLogisticsService: UserLogisticsService, private route: Router) { }
  catalogueArray = [];
  ngOnInit() {
    this.userLogisticsService.GetWarehouseCatalogue().subscribe(res => {
      this.catalogueArray = res;
    })
  }

  modify(objData) {
    let id = objData._id;
    this.route.navigate(['/logistic/setup/service-catalogue/modify', { id }]);
  }

}
