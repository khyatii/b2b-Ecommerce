import { AppError } from './../../apperrors/apperror';
import { LogisticsService } from './../../services/logistics.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-warehouse-service',
  templateUrl: './warehouse-service.component.html',
  styleUrls: ['./warehouse-service.component.css']
})
export class WarehouseServiceComponent implements OnInit {
  warehouseServiceForm: FormGroup;

  constructor(private fb: FormBuilder, private route: Router, private logisticsService: LogisticsService) { }

  ngOnInit() {
    this.warehouseServiceForm = this.fb.group({
      "optProduct": ['', Validators.required],
      "optCountry": [''],
      "optTown": [''],
      "optPriority": ['', Validators.required],
      "optShareTransport": [''],
      "optShareConsignement": ['']
    })
  }

  get optProduct() {
    return this.warehouseServiceForm.controls.optProduct
  }

  get optPriority() {
    return this.warehouseServiceForm.controls.optPriority
  }


  submit(formvalue) {
    this.logisticsService.postWarehouseService(formvalue).subscribe((res => { }),
      (err) => {
        if (err instanceof AppError) {

        }
      })
  }

}
