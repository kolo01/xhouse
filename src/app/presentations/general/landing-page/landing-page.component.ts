import { Component, ViewChild } from '@angular/core';
import { environmentDev } from '../../../../environments/environmentDev';
import { HttpClient } from '@angular/common/http';
import { BaseServicesService } from '../../../core/services/baseServices/base-services.service';
import { Property } from '../../../domains/interfaces/property';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { LocalStorageServiceService } from '../../../core/services/allOthers/local-storage-service.service';
import { AuthentificationService } from '../../../core/services/authenticate/authentification.service';
import {Router, RouterLink} from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { DialogModule } from 'primeng/dialog';
import {NavbarComponent} from '../navbar/navbar.component';
import {FooterComponent} from '../footer/footer.component';





@Component({
  selector: 'app-landing-page2',
  standalone: true,
  imports: [CommonModule, AutoCompleteModule, AvatarModule, DialogModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  properties : Property[] = []
  token: any
  isConnected : boolean = false
  visible : boolean = false
  email = "yeleman.ci@gmail.com"
  showDialog() {
    this.visible = true;
}




  constructor(  private baseService: BaseServicesService, private localStore: LocalStorageServiceService, private isAuthenticate: AuthentificationService, private route: Router) {

  }

ngOnInit(): void {

  this.isConnected= this.localStore.getItem('IsConnected') != null ? true : false;
  if (this.isConnected) {

    this.token = this.localStore.getItem('IsConnected');
    // this.token= JSON.parse(this.localStore.getItem('IsConnected'));
    this.token = this.isConnected ? JSON.parse(this.token) : null;
  }
  this.baseService.getAll("properties").subscribe( (data) => {
    this.properties = data;
    this.properties = this.properties.reverse().slice(0,6)
    console.log("propertis",this.properties)
  },
  (error) => {
    console.error('Error fetching properties:', error);
  });
}

saveTolocalstorage(data:any): void {
  localStorage.setItem('property', JSON.stringify(data));
}

getImageSrc(image: any): string {
  if (image.image) {
    return 'https://res.cloudinary.com/dcjjkfjas/' + image.image;
  }
  return 'assets/images/shooting_photo.png';
}

items: any[] | undefined;

value: any;

search(event: AutoCompleteCompleteEvent) {
    this.items = [...Array(10).keys()].map(item => event.query + '-' + item);
}



logout():void{
  localStorage.removeItem('IsConnected');
  this.route.navigateByUrl("/")
}


testing():void{
  console.log(this.isAuthenticate.isAuhenticate());
  console.log(this.isAuthenticate.getToken());
  console.log(this.isAuthenticate.decodedToken());
}

}
