import { VasSelectionService } from './../../services/vas-selection.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vastable',
  templateUrl: './vastable.component.html',
  styleUrls: ['./vastable.component.css']
})
export class VastableComponent implements OnInit {

  isHide: boolean = true;
  services = [];
  constructor(private vasSelectionService: VasSelectionService) { }

  ngOnInit() {
    this.vasSelectionService.getAllVas().subscribe(
      res => {
        this.services = res;
      }
    )

  }




}
