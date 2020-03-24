import { InventoryService } from './../../services/inventory.service';
import { Component, OnInit, ViewEncapsulation, NgZone,} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl,} from '@angular/forms';
import { MatButtonModule, MatInputModule, MatSelectModule  } from '@angular/material';
import { Router } from '@angular/router';
import { InputOutputService } from '../../services/inputOutput.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  
  ngOnInit() {   
   
  }


  
}