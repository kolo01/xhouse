import { Component, inject } from '@angular/core';
import { Property } from '../../../domains/interfaces/property';
import { BaseServicesService } from '../../../core/services/baseServices/base-services.service';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { ToastrService } from 'ngx-toastr';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { AccordionModule } from 'primeng/accordion';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MessageService} from 'primeng/api';
import {environmentDev} from '../../../../environments/environmentDev';
import {dateTimestampProvider} from 'rxjs/internal/scheduler/dateTimestampProvider';

declare var PaiementPro: any;
@Component({
  selector: 'app-details-property',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    ButtonModule,
    FormsModule,
    DialogModule,
    CalendarModule,
    AccordionModule,
  ],
  templateUrl: './details-property.component.html',
  styleUrl: './details-property.component.scss',
})
export class DetailsPropertyComponent {
  visited = 'https://my.matterport.com/show/?m=tvUpZmt6L4W&play=1';

  property:any;
  id: number = 0;
  slug: any = null;
  selectedProperty: number = 4;
  constructor(
    private route: ActivatedRoute,
    private baseServices: BaseServicesService,
    private toastr: ToastrService,
    private router: Router,
    private messageService: MessageService
  ) {}
  visible: boolean = false;
  visible1: boolean = false;

  locationDate!: Date | null;
  locationComment = '';

  url = '';
  isLoading = false;
  success = false;
  isPaid = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.slug = params.get('slug');
      console.log("slug",this.slug);
      this.id = this.slug;
      this.baseServices.getOne(this.id, `property`).subscribe(
        (data) => {
          this.property = data;
          console.log('this property ::::::', this.property);
        },
        (error) => {
          console.error('Error fetching properties:', error);
        }
      );
    });
    this.route.queryParams.subscribe((params) => {
      console.log(params['responsecode']);
      if (params['responsecode']) {
        if (params['responsecode'] === '0') {
          this.isPaid = true; // Déblocage du contenu
          this.toastr.success('Paiement réussi, contenu débloqué !', 'Succès');
        } else if (params['responsecode'] != '0') {
          this.toastr.warning('Paiement non confirmé ou annulé.', 'Attention');
        }
      }

    });
  }
  //fonction pour une demande de location
  askLocation() {
    this.visible1 = true;
    this.visible = false;
  }
  sendVisitRequest(propertyID: number) {
    if (!this.locationDate || !this.locationComment) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Veuillez selectionner une date et entrer un message !'
      });
      return;
    }

    const date: Date =  this.locationDate;
    const formatedDate = date.toISOString().slice(0,10);
    console.log(date.toISOString().slice(0,10))

    const requestPayload = {
      visit_date: formatedDate,
      property: propertyID,
      comment: this.locationComment.trim(),
    };
    this.baseServices.postWithToken(environmentDev?.endPoint?.demandsVisit?.create, requestPayload).subscribe({
        next: (response) => {
          console.log('Demande de visite envoyée:', response);
          this.resetForm();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Votre demande de visite a bien été envoyée !`
          });
          this.visible = false;
        },
        error: (error) => {
          console.error('Erreur lors de l\'envoi de la demande:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Veuillez corriger les erreurs dans le formulaire.'
        });
          this.visible = true;
        }
      });

      // Rediriger vers la page d'accueil
      // this.router.navigate(['/']);
  }
  resetForm() {
    this.locationDate = null
    this.locationComment = '';
    this.visible = false; // Ferme le dialogue
  }
  //Fonction pour activer la visite virtuelle et la demande de visite apres paiement
  makeVisit() {}

  ///Fonction pour la soumission du formulaire de demande de visite
  askForVisit() {
    this.visible = true;
    this.visible1 = false;
  }
  sendLocationRequest(propertyID: number) {
    if (!this.locationComment) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Veuillez entrer un message !.'
      });
      return;
    }


    const requestPayload = {
      property: propertyID,
      comment: this.locationComment.trim(),
    };
    this.baseServices.postWithToken(environmentDev?.endPoint?.demandsLocation?.create, requestPayload).subscribe({
        next: (response) => {
          console.log('Demande de location envoyée:', response);
          this.resetForm();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Votre demande de location a bien été envoyée !`
          });
          this.visible1 = false;
        },
        error: (error) => {
          console.error('Erreur lors de l\'envoi de la demande:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Veuillez corriger les erreurs dans le formulaire.'
        });
          this.visible = true;
        }
      });
  }

  //Fonction pour afficher un message toast de succès dans le cas ou la demande est valide
  showToastSucces() {
    this.toastr.success('Merci pour votre disponibilité !!!', 'Bienvenue');
  }

  //Fonction pour afficher un message toast de succès dans le cas ou la demande a un probleme
  showToastError() {
    this.toastr.error('Veuillez verifier le formulaire!!!', 'Erreur');
  }

  ///api de paiement

  async initializePaiementPro() {
    console.log('Initializing paiement pro');
    this.isLoading = true;

    try {
      const response = await fetch(
        'https://www.paiementpro.net/webservice/onlinepayment/js/initialize/initialize.php',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            merchantId: 'PP-F3571',
            amount: 10,
            customerId: 2,
            channel: 'O',
            countryCurrencyCode: 952,
            customerEmail: 'konedieu5@gmail.com',
            customerFirstName: 'KONE',
            customerLastname: 'Kolotioloman Dieudonne',
            customerPhoneNumber: '2250584515492',
            referenceNumber: 'VV' + new Date().getTime(),
            notificationURL: 'http://localhost:4200/notification/',
            returnURL: `http://localhost:4200/details/house/${this.slug}`,
            returnContext: 'paiement=2&ok=1&oui=2',
          }),
        }
      );

      const data = await response.json();

      console.log('data', data);

      if (data.success) {
        this.url = data.url;
        window.location.href = data.url; // Redirection vers la page de paiement
      } else {
        this.toastr.error('Erreur lors de l’initiation du paiement', 'Échec');
      }
    } catch (error) {
      console.error('Erreur : ', error);
      this.toastr.error('Erreur réseau ou de serveur.', 'Échec');
    } finally {
      this.isLoading = false;
    }
  }

  // Vérifier le déblocage après le retour du paiement
}
