import { Router, ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import '../assets/app.css';
import { EventEmitter } from '@angular/core/src/event_emitter';
import { OrganizationService } from './_services/organization.service';
import { Organization } from './_models/org';
import { AuthenticationService } from './_services/authentication.service';
import { AlertService } from './_services/alert.service';
import { UserService } from './_services/user.service';
import { Message } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService]
})

export class AppComponent implements OnInit {
  menuMode = 'slim';

  topbarMenuActive: boolean;

  overlayMenuActive: boolean;

  slimMenuActive: boolean;

  slimMenuAnchor: boolean;

  toggleMenuActive: boolean;

  staticMenuDesktopInactive: boolean;

  staticMenuMobileActive: boolean;

  layoutMenuScroller: HTMLDivElement;

  lightMenu = true;

  menuClick: boolean;

  topbarItemClick: boolean;

  activeTopbarItem: any;

  resetMenu: boolean;

  menuHoverActive: boolean;

  rightPanelActive: boolean;

  rightPanelClick: boolean;
  
  loginpage = true;

  constructor(private router: Router,
              private organizationService: OrganizationService,
              private authenticationService: AuthenticationService,
              private alertService: AlertService,
              private activatedRoute: ActivatedRoute,
              private userService: UserService,
              private messageService: MessageService) {}

  onActivate(component) {
    this.toggleMenu();
  }

  ngOnInit() {
    this.toggleMenu();

    AlertService.setService(this.messageService);

    // if we can't find the bearer token in memory, reroute the user to the login page
    if (localStorage.getItem('currentUser') == null && !this.loginpage) {
      this.router.navigate['/login'];
      location.reload();
    }

  }

  toggleMenu() {
    
    if (location.pathname.indexOf('/login') >= 0) {
      this.loginpage = true;
    } else {
      this.loginpage = false;
    }
  }

  onLayoutClick() {
    if (!this.topbarItemClick) {
        this.activeTopbarItem = null;
        this.topbarMenuActive = false;
    }

    if (!this.rightPanelClick) {
        this.rightPanelActive = false;
    }

    if (!this.menuClick) {
        if (this.isHorizontal()) {
            this.resetMenu = true;
        }

        if (this.overlayMenuActive || this.staticMenuMobileActive) {
            this.hideOverlayMenu();
        }

        if (this.slimMenuActive) {
            this.hideSlimMenu();
        }

        if (this.toggleMenuActive) {
            this.hideToggleMenu();
        }

        this.menuHoverActive = false;
    }

    this.topbarItemClick = false;
    this.menuClick = false;
    this.rightPanelClick = false;
}

onMenuButtonClick(event) {
    this.menuClick = true;
    this.topbarMenuActive = false;

    if (this.isOverlay()) {
        this.overlayMenuActive = !this.overlayMenuActive;
    }
    if (this.isToggle()) {
        this.toggleMenuActive = !this.toggleMenuActive;
    }
    if (this.isDesktop()) {
        this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
    } else {
        this.staticMenuMobileActive = !this.staticMenuMobileActive;
    }

    event.preventDefault();
}

onMenuClick($event) {
    this.menuClick = true;
    this.resetMenu = false;
}

onAnchorClick($event) {
    if (this.isSlim()) {
        this.slimMenuAnchor = !this.slimMenuAnchor;
    }
}

onMenuMouseEnter(event) {
    if (this.isSlim()) {
        this.slimMenuActive = true;
    }
}

onMenuMouseLeave(event) {
    if (this.isSlim()) {
        this.slimMenuActive = false;
    }
}

onTopbarMenuButtonClick(event) {
    this.topbarItemClick = true;
    this.topbarMenuActive = !this.topbarMenuActive;

    this.hideOverlayMenu();

    event.preventDefault();
}

onTopbarItemClick(event, item) {
    this.topbarItemClick = true;

    if (this.activeTopbarItem === item) {
        this.activeTopbarItem = null;
    } else {
        this.activeTopbarItem = item;
    }

    event.preventDefault();
}

onTopbarSubItemClick(event) {
    event.preventDefault();
}

onRightPanelButtonClick(event) {
    this.rightPanelClick = true;
    this.rightPanelActive = !this.rightPanelActive;
    event.preventDefault();
}

onRightPanelClick() {
    this.rightPanelClick = true;
}

isHorizontal() {
    return this.menuMode === 'horizontal';
}

isSlim() {
    return this.menuMode === 'slim';
}

isOverlay() {
    return this.menuMode === 'overlay';
}

isToggle() {
    return this.menuMode === 'toggle';
}

isStatic() {
    return this.menuMode === 'static';
}

isMobile() {
    return window.innerWidth < 1281;
}

isDesktop() {
    return window.innerWidth > 1280;
}

isTablet() {
    const width = window.innerWidth;
    return width <= 1280 && width > 640;
}

hideOverlayMenu() {
    this.overlayMenuActive = false;
    this.staticMenuMobileActive = false;
}

hideSlimMenu() {
    this.slimMenuActive = false;
    this.staticMenuMobileActive = false;
}

hideToggleMenu() {
    this.toggleMenuActive = false;
    this.staticMenuMobileActive = false;
}

}

