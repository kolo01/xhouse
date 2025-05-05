import {Component, OnInit} from '@angular/core';
import {SidebarOwnerComponent} from '../../sidebar-owner/sidebar-owner.component';
import {NavabarComponent} from '../../navabar/navabar.component';
import {RouterLink} from '@angular/router';
import {BaseServicesService} from '../../../../core/services/baseServices/base-services.service';
import {Property} from '../../../../domains/interfaces/property';
import {environmentDev} from '../../../../../environments/environmentDev';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {MessageService} from 'primeng/api';
import { LocalStorageServiceService } from '../../../../core/services/allOthers/local-storage-service.service';

@Component({
  selector: 'app-list-property',
  standalone: true,
  imports: [
    SidebarOwnerComponent,
    NavabarComponent,
    RouterLink,
    NgForOf,
    NgClass,
    NgIf,
  ],
  templateUrl: './list-property.component.html',
  styleUrl: './list-property.component.scss'
})
export class ListPropertyComponent implements OnInit{
    properties: Property[] = [];
    allProperties!: number;
    isLoading: boolean = true;

    constructor(private baseService: BaseServicesService, private locale: LocalStorageServiceService, private message: MessageService
    ) {}

    ngOnInit(): void {
      this.loadOwnerProperties();
    }

    loadOwnerProperties() {
      this.isLoading = true;
      this.baseService.getAllWithToken(environmentDev.endPoint.properties.getOwnerProperties).subscribe({
        next: (data: Property[]) => {
          this.properties = data;
          this.allProperties = this.properties.length
          this.isLoading = false;
          this.locale.setItem("numberHouse", data.length > 0  ? data.length : 0)
        },
        error: (error: any) => {
          console.error('Erreur lors du chargement des propriétés:', error);
          this.isLoading = false;
        }
      });
    }
    getImageSrc(image: any): string {
      if (image.image) {
        return 'https://res.cloudinary.com/dcjjkfjas/' + image.image;
      }
      return 'assets/images/shooting_photo.png';
    }
  publishProperty(property: Property): void {
    const updateData = { status: true };
    this.baseService.patchWithSlug(environmentDev.endPoint.properties.update, property.slug, updateData)
      .subscribe(response => {
        console.log('Statut mis à jour :', response);
        this.message.add({
            severity: 'success',
            summary: 'Success',
            detail: `La propriété ${response.label} a bien été publiée sur le site !`
        });
        property.status = true;
      }, error => {
        console.error('Erreur lors de la mise à jour du statut :', error);
        this.message.add({
            severity: 'error',
            summary: 'Erreur',
            detail: `Impossible de publier sur le site actuellement!`
        });
        property.status = false;
      });
  }

  hideProperty(property: Property): void {
    const updateData = { status: false };
    this.baseService.patchWithSlug(environmentDev.endPoint.properties.update, property.slug, updateData)
      .subscribe(response => {
        console.log('Propriété cachée:', response);
        this.message.add({
            severity: 'success',
            summary: 'Success',
            detail: `La propriété ${response.label} a bien été rétirée du site !`
        });
        property.status = false;
      }, error => {
        console.error('Erreur lors de la mise à jour du statut :', error);
        this.message.add({
            severity: 'error',
            summary: 'Erreur',
            detail: `Impossible de rétirer du site actuellement!`
        });
        property.status = true;
      });
  }
}
