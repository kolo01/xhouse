import {Component, OnInit} from '@angular/core';
import {NavabarComponent} from "../../navabar/navabar.component";
import {SidebarOwnerComponent} from "../../sidebar-owner/sidebar-owner.component";
import {Router, RouterLink} from "@angular/router";
import {
  AbstractControl, FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {Property} from '../../../../domains/interfaces/property';
import {BaseServicesService} from '../../../../core/services/baseServices/base-services.service';
import {environmentDev} from '../../../../../environments/environmentDev';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {MessageService} from 'primeng/api';
import {Image} from '../../../../domains/interfaces/image';
import { LocalStorageServiceService } from '../../../../core/services/allOthers/local-storage-service.service';

@Component({
  selector: 'app-add-property',
  standalone: true,
  imports: [
    NavabarComponent,
    SidebarOwnerComponent,
    RouterLink,
    ReactiveFormsModule,
    NgIf,
    NgClass,
    NgForOf
  ],
  templateUrl: './add-property.component.html',
  styleUrl: './add-property.component.scss'
})
export class AddPropertyComponent implements OnInit {
  all:any=0
    propertyForm!: FormGroup;
    isLoading: boolean = false;
    maxImages: number = 5;
    constructor(private baseService: BaseServicesService, private router: Router, private message: MessageService,
                private fb: FormBuilder, private locale: LocalStorageServiceService
                ) {}

  property:Property ={
      id: 0,
      label: "",
      price: 0,
      address: "",
      city: "",
      surface: 0,
      property_type: "",
      description: "",
      bedrooms_number: 0,
      bathrooms_number: 0,
      status: true,
      state: "",
      slug: "",
      characteristics: [],
      images: [],
  };

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.propertyForm = this.fb.group({
      label: ['', [Validators.required, Validators.minLength(5)]],
      price: [null, [Validators.required, Validators.min(1), this.positiveNumberValidator()]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required, Validators.minLength(3)]],
      surface: [null, [Validators.required, Validators.min(1), this.positiveNumberValidator()]],
      property_type: ['', [Validators.required, this.notDefaultValueValidator('')]],
      description: ['', [Validators.required, Validators.minLength(15)]],
      bedrooms_number: [null, [Validators.required, Validators.min(1), Validators.max(10), this.positiveNumberValidator()]],
      bathrooms_number: [null, [Validators.required, Validators.min(1), Validators.max(10), this.positiveNumberValidator()]],
      characteristics: this.fb.group({
        nearby_school_or_university: [false],
        air_conditioning: [false],
        quiet_area: [false],
        swimming_pool: [false],
        commercial_area: [false],
        general_condition_new: [false],
        garden: [false],
        gym_room: [false],
        balcony_terrace: [false],
        furnished: [false],
        furnished_kitchen: [false],
        city_center: [false],
        guardian: [false],
        green_space: [false]
      }),
      images: this.fb.array([], [Validators.required]),
    });
  }

  async submit() {
    if (this.propertyForm.valid) {
      this.isLoading = true;

      this.property.label = this.propertyForm.value.label
      this.property.price = this.propertyForm.value.price
      this.property.address = this.propertyForm.value.address
      this.property.city = this.propertyForm.value.city
      this.property.surface = this.propertyForm.value.surface
      this.property.property_type = this.propertyForm.value.property_type
      this.property.description = this.propertyForm.value.description
      this.property.bedrooms_number = this.propertyForm.value.bedrooms_number
      this.property.bathrooms_number = this.propertyForm.value.bathrooms_number
      this.property.characteristics = [{
        swimming_pool: this.propertyForm.value.characteristics.swimming_pool || false,
        green_space: this.propertyForm.value.characteristics.green_space || false,
        air_conditioning: this.propertyForm.value.characteristics.air_conditioning || false,
        nearby_school_or_university: this.propertyForm.value.characteristics.nearby_school_or_university || false,
        commercial_area: this.propertyForm.value.characteristics.commercial_area || false,
        garden: this.propertyForm.value.characteristics.garden || false,
        quiet_area: this.propertyForm.value.characteristics.quiet_area || false,
        balcony_terrace: this.propertyForm.value.characteristics.balcony_terrace || false,
        gym_room: this.propertyForm.value.characteristics.gym_room || false,
        furnished: this.propertyForm.value.characteristics.furnished || false,
        furnished_kitchen: this.propertyForm.value.characteristics.furnished_kitchen || false,
        city_center: this.propertyForm.value.characteristics.city_center || false,
        general_condition_new: this.propertyForm.value.characteristics.general_condition_new || false,
        guardian: this.propertyForm.value.characteristics.guardian || false,
      }]

      try {
        const response: Property = await this.baseService.postWithToken(environmentDev.endPoint.properties.create, this.property).toPromise();
        await this.uploadImages(response.id);
        this.message.add({
            severity: 'success',
            summary: 'Success',
            detail: `La propriété ${response.label} a bien été enregistrée`
        });

        this.propertyForm.reset();
        this.isLoading = false;
        this.all = this.locale.getItem("numberHouse")
        this.locale.setItem("numberHouse",this.all+1)
        this.router.navigate(['/properties']);
        } catch (error) {
            this.handleApiError(error);
        } finally {
            this.isLoading = false;
        }
    } else {
        console.warn('Formulaire invalide');
        this.message.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Veuillez corriger les erreurs dans le formulaire.'
        });
    }
  }

  async uploadImages(propertyId: number) {
    const formData = new FormData();

    formData.append('property', propertyId.toString());

    this.images.controls.forEach(control => {
        const file = control.value;
        formData.append('image', file, file.name);
    });

    try {
        const response = await this.baseService.post(`${environmentDev.endPoint.images.create}`, formData).toPromise();
        console.log('Images enregistrées avec succès:', response);
    } catch (error) {
        this.handleApiError(error);
    }
  }

  get images(): FormArray {
    return this.propertyForm.get('images') as FormArray;
  }

  onFileChange(event: any) {
      const files: FileList = event.target.files;
      const imagesArray = this.images;

      if (imagesArray) {
          imagesArray.clear();

          if (files.length > this.maxImages) {
              this.message.add({
                  severity: 'warn',
                  summary: 'Limite dépassée',
                  detail: `Vous ne pouvez télécharger que jusqu'à ${this.maxImages} images.`
              });
              return;
          }

          Array.from(files).forEach((file: File) => {
              if (file.type.startsWith('image/') && file.size <= 2 * 1024 * 1024) { // Taille max : 2 Mo
                  imagesArray.push(this.fb.control(file));
              } else {
                  this.message.add({
                      severity: 'warn',
                      summary: 'Format non valide',
                      detail: file.size > 2 * 1024 * 1024 ? 'La taille de l\'image doit être inférieure à 2 Mo.' : 'Seules les images sont acceptées.'
                  });
              }
          });
      } else {
          console.error('Le FormArray images est null ou indéfini.');
      }
  }

  isInvalid(field: AbstractControl) {
    return field.invalid && (field.touched || field.dirty);
  }
  isValid(field: AbstractControl) {
    return field.valid && (field.touched || field.dirty);
  }
  positiveNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      return value > 0 ? null : { 'positive': true }; // Retourne une erreur si le Formcontrol est <= 0
    };
  }
  notDefaultValueValidator(defaultValue: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return control.value === defaultValue ? { 'invalidSelection': true } : null;
    };
  }

  handleApiError(error: any) {
    let errorMessage = 'Une erreur est survenue.';

    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.status === 400) {
      errorMessage = 'Erreur de validation. Veuillez vérifier les données saisies.';
    } else if (error.status === 500) {
      errorMessage = 'Erreur interne du serveur. Veuillez réessayer plus tard.';
    }

    this.message.add({ severity: 'error', summary: 'Erreur API', detail: errorMessage });
  }

  goBack(): void {
    window.history.back();
  }
}
