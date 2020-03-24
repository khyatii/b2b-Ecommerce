import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InventoryService } from '../../services/inventory.service';
import { MatDialog } from '@angular/material';
import { ContactSupplierComponent } from '../contact-supplier/contact-supplier.component';


@Component({
  selector: 'app-search-string',
  templateUrl: './search-string.component.html',
  styleUrls: ['./search-string.component.css']
})
export class SearchStringComponent implements OnInit {
  resultProducts: Array<any>;
  
  constructor(private route: ActivatedRoute, private inventoryService: InventoryService, public dialog: MatDialog) {
    this.route.params.subscribe(params => {
      this.inventoryService.getSeachProducts(params).subscribe(resp => {
        this.resultProducts = resp;
      })
    });
  }

  ngOnInit() {
  }

  contactSupplier(prod) {
    var dialogRef = this.dialog.open(ContactSupplierComponent, {
      data: {product: prod }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
