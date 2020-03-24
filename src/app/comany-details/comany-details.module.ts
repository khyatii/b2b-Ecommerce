import { LoadersCssModule } from 'angular2-loaders-css';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'ng2-file-upload';
import { FormModule } from '../forms/forms.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { JqSparklineModule } from '../components/sparkline/sparkline.module';
import { AlertModule, TooltipModule, ButtonsModule, BsDropdownModule, PaginationModule } from 'ngx-bootstrap';
import { WidgetModule } from '../layout/widget/widget.module';
import { UtilsModule } from '../layout/utils/utils.module';
import { Ng2TableModule } from 'ng2-table';
import { DataTableModule, DataTable } from 'angular2-datatable';
import { MatButtonModule, MatInputModule, MatSelectModule, MatTabsModule, MatAutocompleteModule, MatDatepickerModule, MatSliderModule, MatRadioModule, MatCheckboxModule } from '@angular/material';
import { ComanyDetailsComponent } from './comany-details.component';
import { LocationComponent } from './location/location.component';
import { AddLocationComponent } from './add-location/add-location.component';
import { ModifyLocationComponent } from './modify-location/modify-location.component';
import { CompanyOverviewComponent } from './company-overview/company-overview.component';
import { TeamMembersComponent } from './team-members/team-members.component';
import { AddTeamMembersComponent } from './add-team-members/add-team-members.component';
import { ModifyTeamMembersComponent } from './modify-team-members/modify-team-members.component';
import { InputOutputService } from '../services/inputOutput.service';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { MatCardModule } from '@angular/material/card';
import { CompanyDetailService } from "../services/company-details.services";
import { TeamMemberService } from '../services/teamMember.service';
import { ApprovalComponent } from './approval/approval.component';
import { SetupService } from '../services/setup.service';
import { CompanyOverviewLogisticsComponent } from './company-overview-logistics/company-overview-logistics.component';
const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto',
  keyboard: true
};
export const routes = [
  { path: '', component: ComanyDetailsComponent },
  { path: 'location', component: LocationComponent },
  { path: 'addLocation', component: AddLocationComponent },
  { path: 'modifyLocation', component: ModifyLocationComponent },
  { path: 'companyOverview', component: CompanyOverviewComponent },
  { path: 'companyOverviewLogistics', component: CompanyOverviewLogisticsComponent },
  { path: 'teamMembers', component: TeamMembersComponent },
  { path: 'addTeamMembers', component: AddTeamMembersComponent },
  { path: 'modifyTeamMembers', component: ModifyTeamMembersComponent },
  { path: 'approval', component: ApprovalComponent },
]
@NgModule({
  imports: [MatTabsModule,
    FileUploadModule,
    CommonModule, FormModule, ReactiveFormsModule,
    RouterModule.forChild(routes),
    JqSparklineModule,
    AlertModule.forRoot(),
    TooltipModule.forRoot(),
    ButtonsModule.forRoot(),
    BsDropdownModule.forRoot(),
    PaginationModule.forRoot(),
    WidgetModule,
    UtilsModule,
    Ng2TableModule,
    DataTableModule,
    CommonModule, FormModule, ReactiveFormsModule, MatCardModule, LoadersCssModule,
    MatButtonModule, MatInputModule, MatSelectModule, MatAutocompleteModule, MatDatepickerModule, MatSliderModule, MatRadioModule, MatCheckboxModule,
    SwiperModule
  ],
  declarations: [ComanyDetailsComponent, LocationComponent, CompanyOverviewComponent,
    AddLocationComponent, ModifyLocationComponent, TeamMembersComponent,
    AddTeamMembersComponent, ModifyTeamMembersComponent, ApprovalComponent, CompanyOverviewLogisticsComponent],
  providers: [DataTable, InputOutputService, CompanyDetailService, SetupService,
    TeamMemberService, {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    }]
})
export class ComanyDetailsModule { }
