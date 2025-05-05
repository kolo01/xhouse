import {Component, OnInit} from '@angular/core';
import {NavabarComponent} from "../../navabar/navabar.component";
import {SidebarOwnerComponent} from "../../sidebar-owner/sidebar-owner.component";
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {BaseServicesService} from '../../../../core/services/baseServices/base-services.service';
import {environmentDev} from '../../../../../environments/environmentDev';
import {MessageService} from 'primeng/api';
import {Property} from '../../../../domains/interfaces/property';
import {NgClass, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-detail-property',
  standalone: true,
  imports: [
    NavabarComponent,
    SidebarOwnerComponent,
    NgIf,
    NgForOf,
    RouterLink,
    NgClass
  ],
  templateUrl: './detail-property.component.html',
  styleUrl: './detail-property.component.scss'
})
export class DetailPropertyComponent implements OnInit{
  property!: Property;
  slug: string | null = "";
  constructor(
    private route: ActivatedRoute,
    private baseServices: BaseServicesService,
    private message: MessageService,
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.slug = params.get('slug');
      this.baseServices.getOneWithToken(this.slug, environmentDev.endPoint.properties.getOneByOwner).subscribe(
        (data) => {
          this.property = data;
          console.log('this property ::::::', this.property);
        },
        (error) => {
          console.error('Error fetching properties:', error);
        }
      );
    });
  }

}
