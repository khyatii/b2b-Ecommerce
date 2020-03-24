import 'jquery-slimscroll';

import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule }  from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap';
import { ROUTES }       from './layout.routes';
import {SalesOrderModule} from '../sales-order/sales-order.module'
import { Layout } from './layout.component';
import { Sidebar } from './sidebar/sidebar.component';
import { Navbar } from './navbar/navbar.component';
import { ChatSidebar } from './chat-sidebar/chat-sidebar.component';
import { ChatMessage } from './chat-sidebar/chat-message/chat-message.component';
import { SearchPipe } from './pipes/search.pipe';
import { NotificationLoad } from './notifications/notifications-load.directive';
import { Notifications } from './notifications/notifications.component';
import { UserService } from '../services/user.service';
import { PermissionService } from '../services/permission.service';
import {ChatService} from './chat-sidebar/chat.service';
import { NotificationService } from '../services/notification.service';


@NgModule({
  imports: [
    CommonModule,
    TooltipModule.forRoot(),
    ROUTES,
    FormsModule
  ],

  declarations: [

    Layout,
    Sidebar,
    Navbar,
    ChatSidebar,
    SearchPipe,
    Notifications,
    NotificationLoad,
    ChatMessage,
  ],
  providers:[UserService,PermissionService,ChatService,NotificationService]
})
export class LayoutModule {
}
