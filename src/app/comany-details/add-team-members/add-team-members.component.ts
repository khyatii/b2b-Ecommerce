import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { SignupUser } from '../../signup-user/signup-user.service';
import { TeamMemberService } from '../../services/teamMember.service';
import { EmailValidation } from '../../validators/emailValid';

@Component({
	selector: 'app-add-team-members',
	templateUrl: './add-team-members.component.html',
	styleUrls: ['./add-team-members.component.css']
})
export class AddTeamMembersComponent implements OnInit {
	addMemberForm: any;
	public userDetails: any;
	successMsg: string;
	isSuccess: boolean = true;
	errorMsg: string;
	isError: boolean = true;
	isLoading: boolean = false;

	constructor(private fb: FormBuilder, private userService: UserService, private route: Router,
		private TeamMemberService: TeamMemberService, private signup: SignupUser) { }

	ngOnInit() {
		this.userService.getUser().subscribe(res => {
			this.userDetails = res.doc[0]
		})
		this.addMemberForm = this.fb.group({
			"firstName": ['', Validators.required],
			"lastName": ['', Validators.required],
			"email": ['', [Validators.required, EmailValidation.emailValid]],
		})
	}

	get firstName() {
		return this.addMemberForm.controls.firstName
	}

	get lastName() {
		return this.addMemberForm.controls.lastName
	}

	get email() {
		return this.addMemberForm.controls.email
	}

	submit(formValues) {
		this.isLoading = true;
		formValues.firstName = formValues.firstName
		formValues.lastName = formValues.lastName
		formValues.email = formValues.email
		formValues.admin = false
		this.TeamMemberService.addMember(formValues).subscribe(
			res => {
				//formValues.memberId = res.traderId;
				//this.saveMember(formValues)
				this.successMsg = "Member invitation is sent."
				this.showSuccess();
				this.isLoading = false;

				setTimeout(() => {
					this.route.navigate(['app/companyDetails/teamMembers'])
				})
			},
			err => {
				if (err.err.status == '401') {
					this.errorMsg = "Email Already Exists"
					this.showError();

				} else {
					this.errorMsg = "Some error Occured"
					this.showError();

				}
				this.isLoading = false;
			}
		)
	}

	saveMember(values) {
		this.TeamMemberService.addMember(values).subscribe(
			data => {
			}
		)
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
