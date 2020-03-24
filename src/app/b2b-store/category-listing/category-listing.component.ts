import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryService } from '../../services/inventory.service';
import { MatDialog } from '@angular/material';
import { ContactSupplierComponent } from '../contact-supplier/contact-supplier.component';

@Component({
  selector: 'app-category-listing',
  templateUrl: './category-listing.component.html',
  styleUrls: ['./category-listing.component.css']
})
export class CategoryListingComponent implements OnInit {

  value: { categoryId: any; };
  categoryProducts: any[];
  usersid;
  discount: any[];
  constructor(private router: ActivatedRoute, private inventoryService: InventoryService,
    private route: Router, public dialog: MatDialog) { }

  ngOnInit() {
    this.value = { categoryId: this.router.snapshot.params['id'] }
    this.inventoryService.getCategoryProductDetail(this.value).subscribe(res => {
      let temp = res;
      var empty = []
      temp.forEach(resp => {
        if (resp["traderId"] !== null) {
          empty.push(resp);
        }
      })
      this.categoryProducts = empty;
    })
  }

  getOneProductDetail(objData) {
    var id = objData._id;
    this.route.navigate(['/b2b-store/subCategoryListing/', { id }]);
  }

  contactSupplier(prod) {
    var dialogRef = this.dialog.open(ContactSupplierComponent, {
      data: { product: prod }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
