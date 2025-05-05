import {Component, OnInit} from '@angular/core';
import {NavabarComponent} from "../navabar/navabar.component";
import {SidebarOwnerComponent} from "../sidebar-owner/sidebar-owner.component";
import {BaseServicesService} from '../../../core/services/baseServices/base-services.service';
import { environmentDev} from '../../../../environments/environmentDev';
import {Visit} from '../../../domains/interfaces/visit';
import {DatePipe, NgClass, NgForOf, NgIf, SlicePipe, TitleCasePipe, UpperCasePipe} from '@angular/common';
import {ILocation} from '../../../domains/interfaces/location';
import {Property} from '../../../domains/interfaces/property';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-applying',
  standalone: true,
  imports: [
    NavabarComponent,
    SidebarOwnerComponent,
    NgIf,
    NgForOf,
    DatePipe,
    SlicePipe,
    UpperCasePipe,
    TitleCasePipe,
    NgClass
  ],
  templateUrl: './applying.component.html',
  styleUrl: './applying.component.scss'
})
export class ApplyingComponent implements OnInit{
  allDemandsVisit: Visit[] = [];
  allDemandsLocation: ILocation[] = [];
  allDemandsVisitNumber!: number;
  allDemandsLocationNumber!: number;
  lastFiveRequestVisit!: number;
  lastFiveRequestLocation!: number;
  planned_location!: number;
  planned_visit!: number;
  pending_location!: number;
  pending_visit!: number;
  refused_location!: number;
  refused_visit!: number;

  constructor(private baseService: BaseServicesService, private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.loadOwnerDemandsVisit();
    this.loadOwnerDemandsLocation();
  }
  loadOwnerDemandsVisit() {
      this.baseService.getAllWithToken(environmentDev.endPoint.demandsVisit.getAll).subscribe({
        next: (data: any) => {
          console.log(data)
          this.allDemandsVisit = data.all_requests;
          this.allDemandsVisitNumber = this.allDemandsVisit.length;
          this.lastFiveRequestVisit = data.last_five_requests;
          this.pending_visit = this.allDemandsVisit.filter(request => request.demand_status ===
            'EN_ATTENTE').length;
          this.planned_visit = this.allDemandsVisit.filter(request => request.demand_status ===
            'ACCEPTER').length;
          this.refused_visit = this.allDemandsVisit.filter(request => request.demand_status ===
            'REFUSER').length;
          console.log(this.allDemandsVisit)
        },
        error: (error: any) => {
          console.error('Erreur lors du chargement des demandes de visite:', error);
        }
      });
  }
  loadOwnerDemandsLocation() {
      this.baseService.getAllWithToken(environmentDev.endPoint.demandsLocation.getAll).subscribe({
        next: (data: any) => {
          this.allDemandsLocation = data.all_requests;
          this.allDemandsLocationNumber = this.allDemandsVisit.length;
          this.lastFiveRequestLocation = data.last_five_requests;
          this.pending_location = this.allDemandsLocation.filter(request => request.demand_status ===
            'EN_ATTENTE').length;
          this.planned_location = this.allDemandsLocation.filter(request => request.demand_status ===
            'ACCEPTER').length;
          this.refused_location = this.allDemandsLocation.filter(request => request.demand_status ===
            'REFUSER').length;
          console.log(this.allDemandsLocation)
        },
        error: (error: any) => {
          console.error('Erreur lors du chargement des demandes de location:', error);
        }
      });
  }

  acceptDemandVisit(location: ILocation) {
    const updateData = { demand_status: 'ACCEPTER' };
    this.baseService.patchWithSlug(environmentDev.endPoint.demandsVisit.update, location.id, updateData)
      .subscribe(response => {
        console.log('Statut de la demande mis à jour :', response);
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Demande de visite acceptée !`
        });
        location.demand_status = 'ACCEPTER';
      }, error => {
        console.error('Erreur lors de la mise à jour du statut :', error);
        this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: `Impossible de changer le statut !`
        });
        location.demand_status = 'EN_ATTENTE';
      });

  }
  acceptDemandLocation(location: ILocation) {
    const updateData = { demand_status: 'ACCEPTER' };
    this.baseService.patchWithSlug(environmentDev.endPoint.demandsLocation.update, location.id, updateData)
      .subscribe(response => {
        console.log('Statut de la demande mis à jour :', response);
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Demande de location acceptée !`
        });
        location.demand_status = 'ACCEPTER';
      }, error => {
        console.error('Erreur lors de la mise à jour du statut :', error);
        this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: `Impossible de changer le statut !`
        });
        location.demand_status = 'EN_ATTENTE';
      });
  }
  refuseDemandLocation(location: ILocation) {
    const updateData = { demand_status: 'REFUSER' };
    this.baseService.patchWithSlug(environmentDev.endPoint.demandsLocation.update, location.id, updateData)
      .subscribe(response => {
        console.log('Statut de la demande mis à jour :', response);
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Demande de location refusée !`
        });
        location.demand_status = 'REFUSER';
      }, error => {
        console.error('Erreur lors de la mise à jour du statut :', error);
        this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: `Impossible de changer le statut !`
        });
        location.demand_status = 'EN_ATTENTE';
      });
  }
  refuseDemandVisit(location: ILocation) {
    const updateData = { demand_status: 'REFUSER' };
    this.baseService.patchWithSlug(environmentDev.endPoint.demandsVisit.update, location.id, updateData)
      .subscribe(response => {
        console.log('Statut de la demande mis à jour :', response);
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Demande de visite refusée !`
        });
        location.demand_status = 'REFUSER';
      }, error => {
        console.error('Erreur lors de la mise à jour du statut :', error);
        this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: `Impossible de changer le statut !`
        });
        location.demand_status = 'EN_ATTENTE';
      });
  }

}
