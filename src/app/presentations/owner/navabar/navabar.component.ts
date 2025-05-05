import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';

import {  AvatarModule } from 'primeng/avatar';
import { LocalStorageServiceService } from '../../../core/services/allOthers/local-storage-service.service';

@Component({
  selector: 'app-navabar',
  standalone: true,
  imports: [
    RouterLink,
    AvatarModule,

  ],
  templateUrl: './navabar.component.html',
  styleUrl: './navabar.component.scss'
})
export class NavabarComponent {
constructor(private localStorage: LocalStorageServiceService, private route: Router){}

logout():void{
  localStorage.removeItem('IsConnected');
  this.route.navigateByUrl("/")
}


}
