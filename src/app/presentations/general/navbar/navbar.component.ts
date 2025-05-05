import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { DialogModule } from 'primeng/dialog';
import { BaseServicesService } from '../../../core/services/baseServices/base-services.service';
import { LocalStorageServiceService } from '../../../core/services/allOthers/local-storage-service.service';
import { AuthentificationService } from '../../../core/services/authenticate/authentification.service';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [AvatarModule, DialogModule, CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  visible: boolean = false;
  isConnected : boolean = false
  token: any
  role!: String
  constructor(  private baseService: BaseServicesService, private localStore: LocalStorageServiceService, private isAuthenticate: AuthentificationService, private route: Router) {

  }



  ngOnInit(): void {

    this.isConnected= this.localStore.getItem('IsConnected') != null ? true : false;
    if (this.isConnected) {

      this.token = this.localStore.getItem('IsConnected');
      // this.token= JSON.parse(this.localStore.getItem('IsConnected'));
      this.token = this.isConnected ? JSON.parse(this.token) : null;
      this.role = this.isAuthenticate.decodedToken().userRole
      console.log("token: " + this.token);
    }

  }


  showDialog() {
    this.visible = true;
}

logout():void{
  localStorage.removeItem('IsConnected');
  this.route.navigateByUrl("/")
}

  closeBanner(): void {
    const banner = document.getElementById('topBanner') as HTMLElement;
    const navbar = document.querySelector('.navbar') as HTMLElement;

    if (banner) {
      banner.classList.add('banner-hidden');
    }

    if (navbar) {
      navbar.classList.add('navbar-top');
    }

    localStorage.setItem('bannerClosed', 'true');
  }

  onload = (): void => {
    const bannerClosed = localStorage.getItem('bannerClosed');
    if (bannerClosed === 'true') {
      this.closeBanner();
    }
  };
}
