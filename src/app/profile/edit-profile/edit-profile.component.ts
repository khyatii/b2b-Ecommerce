import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  @ViewChild('selectpopup') selectPopup: any;
  @ViewChild('overlaylayer') overlayer:any;
  profileForm:FormGroup;
  imgsrc: any = "https://static01.nyt.com/images/2019/04/30/arts/30got-nightking/30got-nightking-articleLarge.jpg?quality=75&auto=webp&disable=upscale";
  
  constructor(private fb:FormBuilder, private UserService:UserService) { 


    
  }

  ngOnInit() {
    this.profileForm = this.fb.group({
      "userName":['',[Validators.required, Validators.minLength(2)]],
      "userPhone":['',[Validators.required, Validators.min(10000)]],
      "userBio":[''],
      "userLocation":[''],
      "userGender":[''],
      'userProfilePhoto':null
    })
  }

  selectProfile() {
    debugger;
    this.selectPopup.nativeElement.style.display = "block";
    this.overlayer.nativeElement.style.display = "block";
    // profilep.click();
  }

  imageChanged(eve) {
    if (eve.target.files && eve.target.files[0]) {
      const file = eve.target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        this.imgsrc = reader.result
        this.selectPopup.nativeElement.style.display = "none";
        this.overlayer.nativeElement.style.display = "none";
        this.profileForm.patchValue({
          userProfilePhoto:{
            filename: file.name,
            filetype: file.type,
            value: (<string>reader.result).split(',')[1]
          }
        });
   
        console.log('file is', reader.result)
      };
      reader.readAsDataURL(file);
    }

  }

  selectPicture(fselect) {
    fselect.click();
  }

  clickOutside() {
    this.selectPopup.nativeElement.style.display = "none";
    this.overlayer.nativeElement.style.display = "none";
  }

  updateProfile(vals:any){
    console.log('here are the form values are', vals);
    this.UserService.updateProfile(vals).subscribe((resp=>{
      console.log('resp is', resp);
    }))
  }

  get name() { return this.profileForm.get('userName'); }
  get phone() { return this.profileForm.get('userPhone'); }

}
