import { Router } from '@angular/router';
import { TeamMemberService } from './../../services/teamMember.service';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-team-members',
  templateUrl: './team-members.component.html',
  styleUrls: ['./team-members.component.css']
})
export class TeamMembersComponent implements OnInit {
  searchProductForm:FormGroup;
  permissionForm:FormGroup;
  showDetails:boolean = false;
  teamArray;
  index4:any;
  config2: any = {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: '.swiper-pagination',
    paginationClickable: true,
    nextButton: '.swiper-button-next',
    slidesPerView:6,
    spaceBetween: 30,
    prevButton: '.swiper-button-prev',

    breakpoints: {
      // when window width is <= 320px
      500: {
        slidesPerView: 1,
        spaceBetween:0
        
      },
      // when window width is <= 480px
      690: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      // when window width is <= 640px
      
      950: {
        slidesPerView: 3,
        spaceBetween: 20
      },
      1300:{
        slidesPerView: 4,
        spaceBetween: 20
      },
      1700:{
        slidesPerView: 5,
        spaceBetween: 20
      },
      1930: {
        slidesPerView: 6,
        spaceBetween: 20
      }
    }
  };
  constructor(private fb:FormBuilder,private teamMemberService: TeamMemberService,
    private route:Router) {
   
  }
  

  ngOnInit() {
    this.teamMemberService.getAllMembers().subscribe(
      res=>{
        this.teamArray = res;
        this.swiperfun();        
      }
    )
  }
  fileChange(event) {
    let fileList: FileList = event.target.files;
    if(fileList.length > 0) {
      let file: File = fileList[0];
      var img = (<HTMLInputElement>document.querySelector(".img"));
      var reader = new FileReader();
      reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
      reader.readAsDataURL(file);
    }
  }
  modify(member){
   let id = member._id;
    this.route.navigate(['/app/companyDetails/modifyTeamMembers',{id}]);
  }
  swiperfun(){
    this.config2 = {
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: '.swiper-pagination',
      paginationClickable: true,
      nextButton: '.swiper-button-next',
      slidesPerView:6,
      spaceBetween: 30,
      prevButton: '.swiper-button-prev',

      breakpoints: {
        // when window width is <= 320px
        500: {
          slidesPerView: 1,
          spaceBetween:0
          
        },
        // when window width is <= 480px
        690: {
          slidesPerView: 2,
          spaceBetween: 20
        },
        // when window width is <= 640px
        
        950: {
          slidesPerView: 3,
          spaceBetween: 20
        },
        1300:{
          slidesPerView: 4,
          spaceBetween: 20
        },
        1700:{
          slidesPerView: 5,
          spaceBetween: 20
        },
        1930: {
          slidesPerView: 6,
          spaceBetween: 20
        }
      }
    };
  }
}
