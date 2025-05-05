import { CommonModule } from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BaseServicesService } from '../../../core/services/baseServices/base-services.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

import { LocalStorageServiceService } from '../../../core/services/allOthers/local-storage-service.service';

import {Router, RouterLink} from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { FooterComponent } from "../footer/footer.component";
import { NavbarComponent } from "../navbar/navbar.component";
import { AuthentificationService } from '../../../core/services/authenticate/authentification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    FooterComponent,
    NavbarComponent,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit{
  constructor(
    private baseName: BaseServicesService,
    private toastr: ToastrService,
    private localStore: LocalStorageServiceService,
    private route: Router,
    private authenticate: AuthentificationService
  ) {}

  ///variable

  visible2: boolean = false;
  visible3: boolean = false;
  visible: boolean = false;
  email = '';
  isConnected = false;
  resetMessage:string = '';
  isLoading: boolean = false;

  ///Forms
  myForm!: FormGroup;
  resetFirstForm!: FormGroup;
  resetSecondForm!: FormGroup;
  forgetPass!: FormGroup;

  ///Fonctions

  sendData() {
    this.visible3 = false;
    this.resetMessage= "Mot de passe Modifié avec succés!";

  }

  showDialogModal3() {
    this.visible2 = false;
    this.visible3 = true;
  }

  showDialogModal2() {
    this.email = this.resetFirstForm.value.email;
    console.log(this.email);
    this.visible = false;
    this.visible2 = true;
  }

  showDialogModal() {
    this.visible = true;
  }

  ngOnInit(): void {
    this.myForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(4)]),
      password: new FormControl('', [
        Validators.required,
        Validators.maxLength(30),
        Validators.minLength(8),
      ]),
    });

    // initialisation des forms groups
    this.forgetPass = new FormGroup({
      otp1: new FormControl('1', [
        Validators.required,
        Validators.maxLength(1),
        Validators.minLength(1),
      ]),
      otp2: new FormControl('2', [
        Validators.required,
        Validators.maxLength(1),
        Validators.minLength(1),
      ]),
      otp3: new FormControl('3', [
        Validators.required,
        Validators.maxLength(1),
        Validators.minLength(1),
      ]),
      otp4: new FormControl('4', [
        Validators.required,
        Validators.maxLength(1),
        Validators.minLength(1),
      ]),
    });

    this.resetFirstForm = new FormGroup({
      email: new FormControl<string | null>('', Validators.required),
    });

    this.resetSecondForm = new FormGroup({
      password: new FormControl<string | null>('', Validators.required),
      confirmPassword: new FormControl<string | null>('', Validators.required),
    });

    // Verifiaction de la connexion
    this.isConnected =
      this.localStore.getItem('IsConnected') != null ? true : false;

    if (this.isConnected) {
      this.route.navigate(['/']).then(
        (nav) => {
          console.log(nav); // true if navigation is successful
        },
        (err) => {
          console.log(err); // when there's an error
        }
      );
    }
  }

  onSubmit() {
    // this.route.navigate(['/owner/home']);
    if (this.myForm.valid) {
      this.isLoading = true;
      // Send a POST request
      this.baseName.post('login', this.myForm.value).subscribe({
        next: (response) => {
          this.showToastSucces();
          this.localStore.setItem('IsConnected', JSON.stringify(response));
          // this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Bienvenue!!!' });
          if (this.authenticate.decodedToken().userRole === 'PROPRIETAIRE') {
            this.isLoading = false;
            this.route.navigate(['/home']);
          } else {
            this.isLoading = false;
            this.route.navigate(['/']);
          }
        },
        error: (error) => {
          this.showToastError();
          console.error('Error submitting form!', error);
          this.isLoading = false;
          // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Erreur lors de la connexion' });
        },
      });
    } else {
      console.log('Form is invalid!', this.myForm.errors);
    }
  }

  showToastError(){
      this.toastr.error("Veuillez verifier vos identifiants", 'Erreur lors de la connexion');
  }

  showToastSucces(){
    this.toastr.success("Merci pour votre disponibilité !!!", 'Bienvenue');
}

  isInvalid(field: AbstractControl) {
    return field ? field.invalid && (field.touched || field.dirty) : false;
  }
  isValid(field: AbstractControl) {
    return field ? field.valid && (field.touched || field.dirty) : false;
  }
}
