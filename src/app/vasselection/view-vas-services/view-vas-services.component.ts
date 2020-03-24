import { Component, OnInit } from '@angular/core';
import { VasSelectionService } from './../../services/vas-selection.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-view-vas-services',
  templateUrl: './view-vas-services.component.html',
  styleUrls: ['./view-vas-services.component.css']
})
export class ViewVasServicesComponent implements OnInit {
  allVasServices;
  fee = [];
  industryArray;

  constructor(private vasSelectionService: VasSelectionService, private route: Router) { }

  ngOnInit() {
    this.vasSelectionService.getAllVasServices().subscribe(resp => {
      this.allVasServices = resp;
      var result = resp.filter(respdata => {
        return respdata.serviceCat.length > 1;
      })
    });
  }

  modify(item) {
    var query = { id: item._id }
    this.route.navigate(['/app/vasselection/modifyVas', query]);
  }

  delete(item, index) {
    if (confirm(`Are you sure to delete ` + item.name + ` ?`)) {
      this.vasSelectionService.deleteVasServices(item).subscribe(resp => {
        this.allVasServices.splice(index, 1);
      })
    }
  }

}
