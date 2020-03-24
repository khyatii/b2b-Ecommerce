import { SignupUser } from './../../signup-user/signup-user.service';
import { LogisticsService } from './../../services/logistics.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserLogisticsService } from '../../services/userLogistics.Service';

@Component({
  selector: 'app-modifywarehouse',
  templateUrl: './modifywarehouse.component.html',
  styleUrls: ['./modifywarehouse.component.css']
})
export class ModifywarehouseComponent implements OnInit {
  warehouseArray: any;
  countryCode: any;
  txtWarehouseName: any;
  idRes: any;
  value: { _id: any; };
  warehouseForm: FormGroup;
  citiesArray: any;
  countryArray: any;
  successMsg: string;
  isSuccess: boolean = true;
  errorMsg: string;
  isError: boolean = true;
  isLoading: boolean = false;
  filteredOptions: Observable<string[]>;
  filteredCity: Observable<string[]>;
  ServicesCategories = [];
  serviceNames = [];

  constructor(private fb: FormBuilder, private route: Router,
    private logisticsService: LogisticsService, private userLogisticsService: UserLogisticsService,
    private router: ActivatedRoute, private signupUser: SignupUser) { }

  ngOnInit() {
    this.signupUser.getCountry().subscribe(res => {
      res = res.json();
      this.countryArray = res;
      this.filteredOptions = this.txtCountry.valueChanges
        .startWith(null)
        .map(val => val ? this.filter(val) : this.countryArray.slice());
    })
    this.value = { _id: this.router.snapshot.params['id'] }

    this.warehouseForm = this.fb.group({
      "txtCountry": ['', Validators.required],
      "txtTown": ['', Validators.required],
      "txtWarehouse": ['', Validators.required],
      "txtPriority": ['', Validators.required],
      "txtShareTransportServiceDetails": ['', Validators.required],
      "txtShareConsignmentDetails": ['', Validators.required],
      "serviceType": ['', Validators.required],
      "serviceName": ['', Validators.required]
    })

    this.logisticsService.getOneWarehouseManagement(this.value).subscribe(res => {
      this.txtCountry.setValue(res[0].txtCountry);
      this.txtWarehouse.setValue(res[0].txtWarehouse);
      this.txtWarehouseName = res[0].txtWarehouseName;
      this.serviceType.setValue(res[0].serviceType);
      this.serviceName.setValue(res[0].serviceName);
      this.txtPriority.setValue(res[0].txtPriority);
      this.txtShareTransportServiceDetails.setValue(res[0].txtShareTransportServiceDetails);
      this.txtShareConsignmentDetails.setValue(res[0].txtShareConsignmentDetails);
      this.idRes = res[0]._id;
      this.txtTown.setValue(res[0].txtTown);
      this.countryCode = res[0].txtCountryCode;
      var country = { code: res[0].txtCountryCode }
      var warehouse = { warehousecountry: country.code }

      this.logisticsService.getWarehouseCountry(warehouse).subscribe(resp1 => {
        this.warehouseArray = resp1.data;
      })
      var id = { _id: res[0].txtWarehouse }
      this.userLogisticsService.getServicesTypesForLogi(id).subscribe(resp => {
        this.ServicesCategories = resp[0].type;
        this.serviceNames = resp[0].service
      })
    })


  }
  filter(val: string): string[] {
    const filterValue = val.toLowerCase();
    return this.countryArray.filter
      (function (Product) {
        return Product.name.toLowerCase().includes(filterValue);
      })
  }

  get txtCountry() {
    return this.warehouseForm.controls.txtCountry
  }
  get txtTown() {
    return this.warehouseForm.controls.txtTown
  }
  get txtWarehouse() {
    return this.warehouseForm.controls.txtWarehouse
  }
  get txtPriority() {
    return this.warehouseForm.controls.txtPriority
  }
  get txtShareTransportServiceDetails() {
    return this.warehouseForm.controls.txtShareTransportServiceDetails
  }
  get txtShareConsignmentDetails() {
    return this.warehouseForm.controls.txtShareConsignmentDetails
  }
  get serviceType() {
    return this.warehouseForm.controls.serviceType
  }
  get serviceName() {
    return this.warehouseForm.controls.serviceName
  }

  submit(formValues) {
    this.isLoading = true;
    formValues._id = this.idRes;
    formValues.txtCountryCode = this.countryCode;
    formValues.txtWarehouseName = this.txtWarehouseName;

    this.logisticsService.modifyWarehouseManagement(formValues).subscribe(res => {
      this.isLoading = false;
      this.successMsg = "Warehouse is modified.";
      this.showSuccess();
      setTimeout(() => {
        this.route.navigate(['/app/logistics/warehouse']);
      }, 3000)
    }, err => {
      if (err.err.status == "502") {
        this.errorMsg = "Warehouse Already Exists";
        this.showError();
      } else {
        this.errorMsg = "Some Error Occured";
        this.showError();
      }
      this.isLoading = false;
    })
  }

  countryChanged(country) {
    this.signupUser.getCites(country).subscribe(res => {
      this.citiesArray = res;
      this.filteredCity = this.txtTown.valueChanges
        .startWith(null)
        .map(val => val ? this.filtercity(val) : this.citiesArray.slice());
    });
    this.countryCode = country.code;
    var warehouse = { warehousecountry: country.code }
    this.logisticsService.getWarehouseCountry(warehouse).subscribe(res => {
      this.warehouseArray = res.data;
    })
  }
  filtercity(val: string): string[] {
    const filterValue = val.toLowerCase();
    return this.citiesArray.filter
      (function (Product) {
        return Product.name.toLowerCase().includes(filterValue);
      })
  }

  changeWarehouse(warehouse) {
    this.txtWarehouseName = warehouse.company_name;
    var id = { _id: warehouse._id }
    this.userLogisticsService.getServicesTypesForLogi(id).subscribe(res => {
      this.ServicesCategories = res[0].type;
      this.serviceNames = res[0].service
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

}
