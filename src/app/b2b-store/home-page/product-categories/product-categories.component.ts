import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-categories',
  templateUrl: './product-categories.component.html',
  styleUrls: ['./product-categories.component.css']
})
export class ProductCategoriesComponent implements OnInit {
  index=1;
  index2=2;
  index3=3;
  index5=5;
  config: any = {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    centeredSlides: true,
    pagination: '.swiper-pagination',
    paginationClickable: true,
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    breakpoints: {
      // when window width is <= 320px
      320: {
        slidesPerView: 1,
        spaceBetween:0
        
      },
      // when window width is <= 480px
      480: {
        slidesPerView: 1,
        spaceBetween: 20
      },
      // when window width is <= 640px
      640: {
        slidesPerView: 2,
        spaceBetween: 30
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 30
      },
      1250: {
        slidesPerView: 4,
        spaceBetween: 30
      },
      2000: {
        slidesPerView: 5,
        spaceBetween: 30
      }
    }
  };
  config3: any = {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: '.swiper-pagination', 
    paginationClickable: true,
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    slidesPerView:3,
    loop:true,
    spaceBetween: 10,
    breakpoints: {
      // when window width is <= 320px
      580: {
        slidesPerView: 1,
        spaceBetween: 20
      },
      1024: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      // when window width is <= 480px
     
    }
  };

  config2: any = {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: '.swiper-pagination',
    paginationClickable: true,
    nextButton: '.swiper-button-next',
    slidesPerView:5,
    spaceBetween: 30,
    prevButton: '.swiper-button-prev',
    
    breakpoints: {
      // when window width is <= 320px
      320: {
        slidesPerView: 1,
        spaceBetween:0
        
      },
      // when window width is <= 480px
      640: {
        slidesPerView: 1,
        spaceBetween: 20
      },
      // when window width is <= 640px
      
      900: {
        slidesPerView: 2,
        spaceBetween: 30
      },
      1220:{
        slidesPerView: 3,
        spaceBetween: 30
      },
      1930: {
        slidesPerView: 4,
        spaceBetween: 30
      }
    }
  };
  
  
  constructor() { }
  
  ngOnInit() {
    // let imgpath1='../homeImages/img1withtv.jpg'
    
  }

}
