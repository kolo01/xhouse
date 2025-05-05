import { Component } from '@angular/core';
import {NavabarComponent} from "../navabar/navabar.component";
import {SidebarOwnerComponent} from "../sidebar-owner/sidebar-owner.component";

@Component({
  selector: 'app-tenants',
  standalone: true,
    imports: [
        NavabarComponent,
        SidebarOwnerComponent
    ],
  templateUrl: './tenants.component.html',
  styleUrl: './tenants.component.scss'
})
export class TenantsComponent {

}
