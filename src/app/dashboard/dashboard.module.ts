import { NotificationService } from './../services/notification.service';
import { NgModule, Component  }      from '@angular/core';
import { CommonModule }  from '@angular/common';

import { RouterModule } from '@angular/router';

import 'jquery.animate-number/jquery.animateNumber.js';
import 'jQuery-Mapael/js/jquery.mapael.js';
import 'jQuery-Mapael/js/maps/usa_states';
import 'bootstrap_calendar/bootstrap_calendar/js/bootstrap_calendar.js';

import { Dashboard } from './dashboard.component';
import { WidgetModule } from '../layout/widget/widget.module';
import { UtilsModule } from '../layout/utils/utils.module';
import { RickshawChartModule } from '../components/rickshaw/rickshaw.module';
import { GeoLocationsWidget } from './geo-locations-widget/geo-locations-widget.directive';
import { MarketStatsWidget } from './market-stats-widget/market-stats-widget.component';
import { BootstrapCalendar } from './bootstrap-calendar/bootstrap-calendar.component';
import { NotificationComponent } from './notification/notification.component';

export const routes = [
  { path: '', component: Dashboard, pathMatch: 'full' },
  { path: 'notification', component: NotificationComponent},
];


@NgModule({
  imports: [
    CommonModule,    

    RouterModule.forChild(routes),
    WidgetModule,
    UtilsModule,
    RickshawChartModule
  ],
  declarations: [
    Dashboard,NotificationComponent,
    GeoLocationsWidget,
    BootstrapCalendar,
    MarketStatsWidget,
  ],
  providers:[NotificationService]
})
export class DashboardModule {
  static routes = routes;
}
