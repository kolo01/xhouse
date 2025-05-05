import { Component, OnInit, inject } from '@angular/core';
import { NavabarComponent } from "../../navabar/navabar.component";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { SidebarOwnerComponent } from "../../sidebar-owner/sidebar-owner.component";
import { BaseServicesService } from '../../../../core/services/baseServices/base-services.service';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-update-property',
  standalone: true,
  imports: [
    NavabarComponent,
    RouterLink,
    SidebarOwnerComponent,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './update-property.component.html',
  styleUrl: './update-property.component.scss'
})
export class UpdatePropertyComponent implements OnInit {

  propertyForm!: FormGroup;
  isLoading: boolean = false;
  maxImages: number = 5;
  baseService = inject(BaseServicesService);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  message = inject(MessageService)
  ngOnInit(): void {
    this.loadForm()
  }
  loadForm() {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.baseService.getOneWithToken(slug, 'property').subscribe((response) => {
      this.propertyForm.patchValue(response);
    })
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
  goBack(): void {
    window.history.back();
  }
  submit() {
    throw new Error('Method not implemented.');
  }
}
