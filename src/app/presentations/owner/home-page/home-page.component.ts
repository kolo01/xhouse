import {Component, OnInit} from '@angular/core';
import { SidebarOwnerComponent } from "../sidebar-owner/sidebar-owner.component";
import {NavabarComponent} from "../navabar/navabar.component";
import {BaseServicesService} from '../../../core/services/baseServices/base-services.service';
import {environmentDev} from '../../../../environments/environmentDev';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [SidebarOwnerComponent, NavabarComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit{
  dashboard: any;

  constructor(private baservice: BaseServicesService) {
  }
  ngOnInit(): void {
    this.baservice.getAllWithToken(environmentDev.endPoint.dashboard.getAll).subscribe({
        next: (data: any) => {
          this.dashboard = data;
          console.log(data)
        },
        error: (error: any) => {
          console.error('Erreur lors du chargement du dasboard:', error);
        }
      });
  }

}
