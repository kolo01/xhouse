import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {NavabarComponent} from '../navabar/navabar.component';

@Component({
  selector: 'app-sidebar-owner',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    RouterLinkActive,
    NavabarComponent
  ],
  templateUrl: './sidebar-owner.component.html',
  styleUrl: './sidebar-owner.component.scss'
})
export class SidebarOwnerComponent {

}
