import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page.component';
import { RouterModule } from '@angular/router';
import { ProductCategoriesComponent } from './product-categories/product-categories.component';
import { MatButtonModule, MatInputModule, MatFormFieldModule, MatListModule, MatIconModule, MatCardModule } from '@angular/material';
import { CarouselModule } from 'ngx-bootstrap'
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
// import { SidenavComponent } from '../sidenav/sidenav.component';
import { SharedModule } from '../sharedModule.module';

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto',
  keyboard: true
};

export const routes = [
  { path: '', component: HomePageComponent}]
@NgModule({
  imports: [SwiperModule,MatCardModule,
    CommonModule,RouterModule.forChild(routes), MatButtonModule,MatInputModule,
    MatFormFieldModule,MatIconModule,CarouselModule.forRoot(),SharedModule
  ],
  declarations: [HomePageComponent, ProductCategoriesComponent],
  providers: [
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    }
  ]
})

export class HomePageModule { }
