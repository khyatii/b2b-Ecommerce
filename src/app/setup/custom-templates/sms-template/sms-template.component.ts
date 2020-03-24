import { Subject } from 'rxjs/Subject';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { TemplateContentService } from '../email-template/templateContent.service';


@Component({
  selector: 'app-sms-template',
  templateUrl: './sms-template.component.html',
  styleUrls: ['./sms-template.component.css']
})
export class SmsTemplateComponent implements OnInit {
  templateSubject: string;
  templateName: string;
  templateArray: Array<object>;
  templateText:String;
  isHide:boolean=false;
  templateForm:FormGroup;

  constructor(private fb:FormBuilder,private templateContentService:TemplateContentService) { }

  ngOnInit() {
     this.templateForm = this.fb.group({
      "txtTemplateName":[''],
      "txtSubject":[''],
      "txtTemplateText":[''],
    })
    this.templateArray=this.templateContentService.templateArray
  }
  
  hide(){
    this.templateForm.reset();
    this.isHide = !this.isHide;
  }

  submit(formvalue){
    this.templateForm.reset();
    this.isHide = true;
    this.templateContentService.templateArray.push(formvalue)
  }

  showEmailTemplate(chosenTemplate){
    if(chosenTemplate == undefined){
      this.isHide=!this.isHide;
      this.templateName=""
      this.templateSubject=""
      this.templateText="";
      return;
    }
    this.isHide=!this.isHide;
    this.templateName=chosenTemplate.txtTemplateName
    this.templateSubject=chosenTemplate.txtSubject
    this.templateText=chosenTemplate.txtTemplateText
  }
}
