import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy, AfterViewInit, EventEmitter, Input, Output } from '@angular/core';
import { SetupService } from '../../../services/setup.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-email-template',
	templateUrl: './email-template.component.html',
	styleUrls: ['./email-template.component.css']
})
export class EmailTemplateComponent implements OnInit, AfterViewInit, OnDestroy {
	reqId: any;
	defaultTemplateArr: any;
	isUpdateButton: boolean;
	id: { _id: any; };
	templateArray: Array<object>;
	templateSubject: String;
	clearTemplate: ['fkdls']
	isHide: boolean = true;
	templateForm: FormGroup;
	templateName: String;
	@Input() elementId: String;
	@Output() onEditorKeyup = new EventEmitter<any>();
	editor;


	ngAfterViewInit() {

		tinymce.init({
			selector: 'textarea',
			height: 300,
			plugins: ['link', 'paste', 'table'],
			skin_url: 'assets/skins/lightgray',
			force_br_newlines: true,
			setup: editor => {
				this.editor = editor;
				editor.on('keyup', () => {
					const content = editor.getContent();
					this.onEditorKeyup.emit(content);
				});
			},
		});
	}

	ngOnDestroy() {
		tinymce.remove(this.editor);
	}

	constructor(private fb: FormBuilder, private route: Router,
		private setupService: SetupService) { }

	ngOnInit() {
		this.templateForm = this.fb.group({
			"txtTemplateName": ['', Validators.required],
			"txtSubject": ['', Validators.required],
			"txtTemplateText": ['', Validators.required],
			"selDefaultTemplate": [''],
			"selPlaceHolder": [''],
		})
		this.id = { _id: '' };
		this.getTemplate(this.id);

		this.setupService.getTemplate().subscribe(
			res => {
				this.templateArray = res;
				// this.reqId = res[0].id;
			},
			err => {
			}
		)
	}
	hide() {

		this.isHide = !this.isHide;
	}


	submit(formvalue) {
		formvalue.txtTemplateText = this.editor.getContent()
		this.isHide = true;
		this.setupService.addTemplate(formvalue).subscribe(res => {
			this.ngOnInit();
		})
	}

	modify(objData) {
		let id = objData._id;
		this.route.navigate(['/app/setup/modifyEmailTemplate', { id }]);
	}

	update(formvalue) {
		formvalue.txtTemplateText = this.editor.getContent();
		formvalue._id = this.reqId;
		this.isHide = true;
		this.setupService.modifyTemplate(formvalue).subscribe(res => {
			this.ngOnInit();
		})
	}


	showEmailTemplate(chosenTemplate) {
		this.templateForm.reset();

		if (chosenTemplate == undefined) {
			this.isHide = !this.isHide;
			this.templateName = "";
			this.templateSubject = "";
			tinymce.activeEditor.setContent("");
			this.isUpdateButton = false;
			return
		}
		else {
			this.isUpdateButton = true;
			this.id = { _id: chosenTemplate._id };
			this.reqId = chosenTemplate._id;
			this.setupService.getOneTemplate(this.id).subscribe(
				resp => {
					this.isHide = !this.isHide;
					this.templateForm.controls.txtTemplateName.setValue(resp[0].txtTemplateName)
					this.templateForm.controls.txtSubject.setValue(resp[0].txtSubject)
					tinymce.activeEditor.setContent(resp[0].txtTemplateText);
				},
				err => {
					alert('Some error Occured')
				}
			)
		}
	}

	selectDefaultTemplate(e) {

		this.id = { _id: e.value };

		this.setupService.getDefaultTemplate(this.id).subscribe(
			resp => {
				tinymce.activeEditor.setContent(resp[0].txtTemplateText);
			},
			err => {
				alert('Some error Occured')
			}
		)
		//tinymce.activeEditor.setContent('<div>\n<div>&nbsp;</div>\n<div>Hello {{user}},</div>\n<div>&nbsp;</div>\n<div>Your Password recreation request has been approved.</div>\n<div>Kindly set your password by clicking the following link</div>\n<div>{{clientUrl}}</div>\n<div>&nbsp;</div>\n</div>\n<p>~Nicoza Team</p>');

	}

	getTemplate(id) {
		this.setupService.getDefaultTemplate(id).subscribe(
			resp => {
				this.defaultTemplateArr = resp;
			},
			err => {
				alert('Some error Occured')
			}
		)
	}

	get txtTemplateName() {
		return this.templateForm.controls.txtTemplateName
	}
	get txtSubject() {
		return this.templateForm.controls.txtSubject
	}
	get txtTemplateText() {
		return this.templateForm.controls.txtTemplateText
	}

	setPlaceHolder(e) {
		//tinymce.activeEditor.setContent(e.value);
		tinymce.activeEditor.execCommand('mceInsertContent', false, "{{" + e.value + "}}");

	}

}
