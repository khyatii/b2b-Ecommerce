import { Component, OnInit } from '@angular/core';
import { UserService } from './../../services/user.service';
import { LogisticsService } from '../../services/logistics.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
  selector: 'app-approve-warehouse-requst',
  templateUrl: './approve-warehouse-requst.component.html',
  styleUrls: ['./approve-warehouse-requst.component.scss']
})
export class ApproveWarehouseRequstComponent implements OnInit {
  logisticType;
  isData = true;
  requestedArr = [];
  tempArr = [];
  updatedItems = [];
  selected;
  set = 'accepted';
  unset = 'rejected';
  rejectArr = [];
  isPending = false;
  isComplete = false;

  constructor(private spinnerService: Ng4LoadingSpinnerService,private userservice: UserService, private logisticservice: LogisticsService) { }

  ngOnInit() {
    this.spinnerService.show()
    this.userservice.getLogisticData().subscribe(res => {
      this.logisticType = res[0].​​logistics_type[0];
      this.getData();
      this.spinnerService.hide()
    });
  }

  setStatus(item, isAccept) {
    let data = {};
    data['requestId'] = item._id;
    data['isAccepted'] = isAccept;
    data['trader'] = item.traderId.email;

    if (this.logisticType === 'Warehouse')
      this.logisticservice.setLogisticStatusWarehouse(data).subscribe(resp => {
        // this.statusUpdate(item);
        this.getData();

      })

    else if (this.logisticType === 'Transport')
      this.logisticservice.setLogisticStatusTransport(data).subscribe(resp => {
        // this.statusUpdate(item)
        this.getData();
      })

    else if (this.logisticType === 'Clearing')
      this.logisticservice.setLogisticStatusClearing(data).subscribe(resp => {
        // this.statusUpdate(item)
        this.getData();
      })

    else if (this.logisticType === 'Insurance')
      this.logisticservice.setLogisticSInsurance(data).subscribe(resp => {
        // this.statusUpdate(item)
        this.getData();
      })
  }

  // public statusUpdate(item){
  //   this.requestedArr.splice(this.requestedArr.indexOf(item),1);
  // }

  public getData() {
    if (this.logisticType === 'Warehouse')
      this.logisticservice.getWarehouseRequests().subscribe(res => {
        this.isData = false;
        this.requestedArr = res.data;
        this.pendingstatus()
      })

    else if (this.logisticType === 'Transport')
      this.logisticservice.getTransportRequests().subscribe(res => {
        this.isData = false;
        this.requestedArr = res.data;
        this.pendingstatus()
      })

    else if (this.logisticType === 'Clearing')
      this.logisticservice.getClearanceRequests().subscribe(res => {
        this.isData = false;
        this.requestedArr = res.data;
        this.pendingstatus()
      })

    else if (this.logisticType === 'Insurance')
      this.logisticservice.getInsuranceRequests().subscribe(res => {
        this.isData = false;
        this.requestedArr = res.data;
        this.pendingstatus()
      })
  }

  public pendingstatus() {
    this.requestedArr.forEach(item => {
      if (item.statusLogistic == 'pending') this.isPending = true;
      if (item.statusLogistic !== 'pending') this.isComplete = true
    })
  }

}
