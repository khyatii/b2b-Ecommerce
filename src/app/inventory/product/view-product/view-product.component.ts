import { UserService } from './../../../services/user.service';
import { Url } from './../../../common/serverurl.class';
import { Component, OnInit, NgZone, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryService } from '../../../services/inventory.service';
import { InputOutputService } from '../../../services/inputOutput.service';
import { PermissionService } from '../../../services/permission.service';
import { SetupService } from '../../../services/setup.service';
import { Papa } from 'ngx-papaparse';
@Component({
	selector: 'app-view-product',
	templateUrl: './view-product.component.html',
	styleUrls: ['./view-product.component.css']

})
export class ViewProductComponent implements OnInit {
	productApproval: any;
	permission;
	traderId: { 'traderId': any; };
	fileName: string = "Select file to Upload";
	array: any
	productArray: Array<object>;
	data: any;
	isData = false;
	gridView: boolean = false;
	tableView: boolean = true;
	fileUploaded: FormData;
	successMsg: string;
	isSuccess: boolean = true;
	errorMsg: string;
	isError: boolean = true;
	selectedFile: File = null;
	fileCount;
	isHide: boolean = false;
	searchText;
	constructor(private fb: FormBuilder, private route: Router, private zone: NgZone,
		private inventoryService: InventoryService, private userService: UserService,
		private permissionService: PermissionService, private setupService: SetupService, private papa: Papa, private elRef: ElementRef) {
	}
	ngOnInit() {
		let model = this.elRef.nativeElement.getElementsByClassName('modal');
		this.inventoryService.getProduct().subscribe(res => {
			this.productArray = res;
		})
		this.userService.getUser().subscribe(res1 => {
			this.traderId = { 'traderId': res1.doc[0]._id };
		})
	}

	addProduct() {
		this.permissionService.getModulePermissions().subscribe(resp => {
			this.permission = {
				InventoryPermission: resp[0].txtInventoryPermission,
			}
			if (this.permission.InventoryPermission == 'rw') {
				this.route.navigate(['/app/inventory/product/add']);
			}
			else {
				this.errorMsg = "You Don't have the appropriate permission"
				this.showError()
			}
		})
	}
	changeView(grid: boolean, table: boolean) {
		this.gridView = grid;
		this.tableView = table
	}

	modifyProduct(objData) {
		this.permissionService.getModulePermissions().subscribe(resp => {
			this.permission = {
				InventoryPermission: resp[0].txtInventoryPermission,
			}
			if (this.permission.InventoryPermission == 'rw') {
				let id = objData._id;
				this.route.navigate(['/app/inventory/product/modify', { id }]);
			}
			else {
				this.errorMsg = "You Don't have the appropriate permission"
				this.showError()
			}
		})
	}

	triggerFile(ref) {
		ref.click();
	}

	fileChange(eve) {
		// this.fileName = ref.files["0"].name;

		this.selectedFile = <File>eve.target.files[0];
		this.fileCount = eve.target.files.length;

	}
	clickTerms(terms) {
		terms.style.display = 'block';
	}
	closeOutside(terms) {
		terms.style.display = 'none';
	}


	upload() { //importfile was one recieving arg befor
		let modelEle = this.elRef.nativeElement.getElementsByClassName('modal')
		const formdata = new FormData();
		this.permissionService.getModulePermissions().subscribe(resp => {
			this.permission = {
				InventoryPermission: resp[0].txtInventoryPermission,
			}

			if (this.permission.InventoryPermission == 'rw') {
				if (this.fileCount > 0) {
					formdata.append('csv', this.selectedFile, this.selectedFile.name);
					this.isData = true;
					this.inventoryService.postImportDoc(this.traderId, formdata).subscribe(
						res => {
							modelEle[0].style.display = 'none';
							this.isData = false;
							alert('product uploded Successfully')
							this.ngOnInit();
						}, err => {
							modelEle[0].style.display = 'none';
							this.isData = false;
							let message = JSON.parse(err.err._body);
							alert(message.message);
						}
					)
				}
			} else {
				this.errorMsg = "You Don't have the appropriate permission"
				this.showError()
			}
		})
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


	changeApproval(x) {
		this.inventoryService.changeApprovalStatus(x).subscribe(res => {
			this.ngOnInit()
		})
	}
}
