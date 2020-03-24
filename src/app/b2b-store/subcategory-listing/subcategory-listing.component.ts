import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryService } from '../../services/inventory.service';
import { MatDialog } from '@angular/material';
import { ContactSupplierComponent } from '../contact-supplier/contact-supplier.component';

export interface DialogData {
  product: any;
}


@Component({
  selector: 'app-subcategory-listing',
  templateUrl: './subcategory-listing.component.html',
  styleUrls: ['./subcategory-listing.component.css']
})

export class SubcategoryListingComponent implements OnInit {


  @Input() event: Event;
  value: { subcatId: any; };
  products: any[];
  usersid;
  discount: any[];

  constructor(private router: ActivatedRoute, private inventoryService: InventoryService,
    private route: Router, public dialog: MatDialog) { }

  ngOnInit() {
    this.value = { subcatId: this.router.snapshot.params['id'] }
    this.inventoryService.getSubCategoryDetails(this.value).subscribe(res => {
      this.products = res;
    })
  }

  contactSupplier(prod) {
    const dialogRef = this.dialog.open(ContactSupplierComponent, {
      maxWidth: '70vw',
      data: { product: prod }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}


