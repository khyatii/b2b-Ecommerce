import 'jquery-slimscroll';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap';
import { ROUTES } from './layout-logistic.routes';
import{ LayoutLogisticComponent} from './layout-logistic.component'
import { UserService } from '../services/user.service';
import { PermissionService } from '../services/permission.service';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarlogisticComponent } from './sidebarlogistic/sidebarlogistic.component'
import { ChatSidebar } from './chat-sidebar/chat-sidebar.component';
import { ChatMessage } from './chat-sidebar/chat-message/chat-message.component';
import { SearchPipe } from './pipes/search.pipe';
import { NotificationLoad } from './notifications/notifications-load.directive';
import { Notifications } from './notifications/notifications.component';
@NgModule({
    imports: [
        CommonModule,
        TooltipModule.forRoot(),
        ROUTES,
        FormsModule
    ],
    declarations: [
        LayoutLogisticComponent,
        SidebarlogisticComponent,
        NavbarComponent,
        ChatSidebar,
        SearchPipe,
        Notifications,
        NotificationLoad,
        ChatMessage,],
    providers: [UserService, PermissionService]
})
export class LayoutLogisticModule {
}
