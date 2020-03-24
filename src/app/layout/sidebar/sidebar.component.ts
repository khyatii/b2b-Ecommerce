import { Component, OnInit, ElementRef, OnChanges} from '@angular/core';
import { UserService } from './../../services/user.service';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { AppConfig } from '../../app.config';
import { PermissionService } from '../../services/permission.service';
declare let jQuery: any;
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../../store/store';
import { SET_USER } from '../../store/action';

@Component({
	selector: '[sidebar]',
	templateUrl: './sidebar.template.html'
})

export class Sidebar implements OnInit, OnChanges {
	@select() userType:any;
	permission;
	traderBoth: any;
	trader: String;
	isAdmin: any;
	$el: any;
	config: any;
	router: Router;
	location: Location;
	data:any;
	isDataLoaded:any=false;

	constructor(private spinnerService: Ng4LoadingSpinnerService,
		config: AppConfig, el: ElementRef, router: Router, location: Location,
		public userService: UserService, private permissionService: PermissionService,
		private ngRedux: NgRedux<IAppState>) {
		this.$el = jQuery(el.nativeElement);
		this.config = config.getConfig();
		this.router = router;
		this.location = location;
	}

	initSidebarScroll(): void {
		let $sidebarContent = this.$el.find('.js-sidebar-content');
		if (this.$el.find('.slimScrollDiv').length !== 0) {
			$sidebarContent.slimscroll({
				destroy: true
			});
		}
		$sidebarContent.slimscroll({
			height: window.innerHeight,
			size: '4px'
		});
	}

	changeActiveNavigationItem(location): void {
		let $newActiveLink = this.$el.find('a[href="#' + location.path().split('?')[0] + '"]');

		// collapse .collapse only if new and old active links belong to different .collapse
		if (!$newActiveLink.is('.active > .collapse > li > a')) {
			this.$el.find('.active .active').closest('.collapse').collapse('hide');
		}
		this.$el.find('.sidebar-nav .active').removeClass('active');

		$newActiveLink.closest('li').addClass('active')
			.parents('li').addClass('active');

		// uncollapse parent
		$newActiveLink.closest('.collapse').addClass('in').css('height', '')
			.siblings('a[data-toggle=collapse]').removeClass('collapsed');
	}

	ngAfterViewInit(): void {
		this.changeActiveNavigationItem(this.location);
	}

	ngOnInit(): void {
		   this.spinnerService.show();
		   this.userService.getUser().subscribe(res => {
			this.ngRedux.dispatch({ type:SET_USER, item:res.doc[0]})
			// setTimeout(()=>{console.log('get state', this.ngRedux.getState())},3000)
			this.trader = res.doc[0].trader_type;
			this.traderBoth = res.doc[0].trader_type;
			this.data = { adminStatus: res.doc[1].admin };
			if (this.traderBoth == 'Both') {
				this.trader = 'Buyer';
			}

			this.permissionService.getPermissions(this.data).subscribe(resp => {
				this.spinnerService.hide()
				this.permission = {
					InventoryPermission: resp[0].txtInventoryPermission,
					SettingsPermission: resp[0].txtSettingsPermission,
					CustomersPermission: resp[0].txtCustomerManagement,
					VendorsPermission: resp[0].VendorsPermission,
					LogisticsPermission: resp[0].txtLogisticsPermission,
					txtStockPermission: resp[0].txtStockPermission,
					PurchaseOrderPermission: resp[0].PurchaseOrderPermission,
					SalesOrderPermission: resp[0].SalesOrderPermission,
					// txtReportsPermission:resp[0].txtReportsPermission,
					admin: resp[0].admin
				}
				this.isDataLoaded = true;
			})
		},(err) => {
			if(err.err.status == '403')  this.router.navigate(['/b2b-store']);
    });

		jQuery(window).on('sn:resize', this.initSidebarScroll.bind(this));
		this.initSidebarScroll();

		this.router.events.subscribe((event) => {
			if (event instanceof NavigationEnd) {
				this.changeActiveNavigationItem(this.location);
			}
		});
	}

	selectBuyer(e) {
		this.trader = 'Buyer'
		e.parentElement.getElementsByTagName('span')[0].style.color = '#aaa';
		e.parentElement.getElementsByTagName('span')[1].style.color = '#aaa';
		e.style.color = '#f0741b';
	}

	selectSeller(e) {
		this.trader = 'Seller'
		e.parentElement.getElementsByTagName('span')[0].style.color = '#aaa';
		e.parentElement.getElementsByTagName('span')[1].style.color = '#aaa';
		e.style.color = '#f0741b';
	}

	ngOnChanges(){
		console.log('changed state of', this.userType)
	}
}
