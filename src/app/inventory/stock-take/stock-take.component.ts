import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { PermissionService } from '../../services/permission.service';

@Component({
	selector: 'app-stock-take',
	templateUrl: './stock-take.component.html',
	styleUrls: ['./stock-take.component.css']
})
export class StockTakeComponent implements OnInit {
	locationArray: any;
	productArray
	storageLocation
	value = 0
	quantityChanged = 0;
	isSuccess: boolean = true;
	errorMsg: string;
	successMsg: string;
	isError: boolean = true;
	permission;
	searchText;
	isHide: boolean = false;
	constructor(private inventoryService: InventoryService, private permissionService: PermissionService) { }

	ngOnInit() {
		this.inventoryService.getLocation().subscribe(res => {
			this.locationArray = res;
		})
	}

	changStorage(location) {
		let id = { id: location };
		this.inventoryService.stockInLocation(id).subscribe(res => {
			this.productArray = res
		})
	}

	changeQuantity(quantity, previous) {
		if (quantity <= 0) {
			this.quantityChanged = 0
			this.value = 0
		}
		else {
			this.quantityChanged = parseInt(quantity) - parseInt(previous)
		}

	}

	modifyProduct(x, qty) {
		this.permissionService.getModulePermissions().subscribe(resp => {
			this.permission = {
				txtStockPermission: resp[0].txtStockPermission,
			}
			if (this.permission.txtStockPermission == 'rw') {
				let location = x.txtStorageLocation;
				let formValue = {
					'id': x._id,
					updateQty: qty,
				}
				if (qty === '' || qty === null || qty === undefined) {
					this.errorMsg = "Stock can't be blank"
					this.showError()
				} else {
					this.inventoryService.updateQuantity(formValue).subscribe(res => {
						let id = { id: location };
						this.inventoryService.stockInLocation(id).subscribe(res => {
							this.productArray = res;
							this.successMsg = "Stock Updated";
						});
					});
				}
			}
			else {
				this.errorMsg = "You Don't have the appropriate permission"
				this.showError()
			}
		})

	}
	keyPress(evt: any) {
		evt = (evt) ? evt : window.event;
		var charCode = (evt.which) ? evt.which : evt.keyCode;
		if (charCode > 31 && (charCode < 48 || charCode > 57)) {
			return false;
		}
		return true;
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

}
