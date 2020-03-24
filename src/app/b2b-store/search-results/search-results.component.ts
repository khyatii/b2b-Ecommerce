import { Component, OnInit } from '@angular/core';
import { CommonService } from '../commonService/common.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';
import { InventoryService } from '../../services/inventory.service';
import { MatDialog } from '@angular/material';
import { ContactSupplierComponent } from '../contact-supplier/contact-supplier.component';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
})
export class SearchResultsComponent implements OnInit {
  subscription: Subscription;

  value: { subcatId: any; };
  data;
  data1;
  id: number;
  private sub: any;
  products: Array<any> = [];

  constructor(private commonService: CommonService, private route: ActivatedRoute,
    private inventoryService: InventoryService, public dialog: MatDialog) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.value = { subcatId: params['id'] }
      this.inventoryService.getSubCategoryDetails(this.value).subscribe(res => {
        this.products = res;
      })
    });

  }
  contactSupplier(prod) {
    var dialogRef = this.dialog.open(ContactSupplierComponent, {
      data: { product: prod }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
