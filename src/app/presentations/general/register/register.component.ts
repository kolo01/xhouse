import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule, ValidationErrors, Validators,
} from '@angular/forms';
import { BaseServicesService } from '../../../core/services/baseServices/base-services.service';
import { LocalStorageServiceService } from '../../../core/services/allOthers/local-storage-service.service';
import { FooterComponent } from "../footer/footer.component";
import { NavbarComponent } from "../navbar/navbar.component";
import { ButtonModule } from 'primeng/button';
import {PasswordModule} from 'primeng/password';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FooterComponent, NavbarComponent, ButtonModule, RouterLink, PasswordModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  formInsc!: FormGroup;
  isloading = false;
  message = '';
  isPasswordVisible = false;

  constructor(
    private router: Router,
    private baseService: BaseServicesService,
    private localeStore: LocalStorageServiceService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.activatedRoute.fragment.subscribe((fragment: string | null) => {
      if (fragment) this.jumpToSection(fragment);
    });
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.formInsc = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(8),
      this.passwordComplexityValidator]),
      confirmPassword: new FormControl('',[Validators.required]),
      username: new FormControl('', [Validators.required, Validators.minLength(4)]),
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.email, Validators.required]),
      user_type: new FormControl('', [Validators.required])
    },  { validators: this.passwordMatchValidator });
  }

  handleSubmit(): void {
    if (this.formInsc.valid) {
      const data = {
          username: this.formInsc.value.username,
          password: this.formInsc.value.password,
          first_name: this.formInsc.value.first_name,
          last_name: this.formInsc.value.last_name,
          email: this.formInsc.value.email,
          user_type: this.formInsc.value.user_type,
        }
      this.isloading = true;
      this.baseService.post('users', data).subscribe(
        (res: any) => {

          this.localeStore.setItem('username', this.formInsc.value.username);
          this.localeStore.setItem('email', this.formInsc.value.email);
          this.formInsc.reset();
          this.isloading = false;
          this.router.navigate(['/otp_validator']);
        },
        (error: any) => {
          this.isloading = false;
          if (error.status === 400) {
            if(error.error.email[0]) {
              this.message = "Ce mail existe déjà !";
            } else if(error.error.username) {
              this.message = "Ce nom d'utilisateur existe déjà !";
            } else {
            this.message = "Erreur lors de l'inscription. Veuillez réessayer.";
            }
          } else {
            this.message = "Erreur lors de l'inscription. Veuillez réessayer.";
          }
          this.message = "Erreur au niveau du serveur !";
          this.isloading = false;
          console.log(error);
        }
      );
    }else{
      this.message = "Veuillez remplir tout les champs !"
      this.isloading = false;
    }
  }

  jumpToSection(section: string | null) {
    if (section) document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
  }

  passwordMatchValidator(form: AbstractControl): { [key: string]: boolean } | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
      if (!password || !confirmPassword) {
        return null;
      }
    return password === confirmPassword ? null : { mismatch: true };
  }
  passwordComplexityValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPattern.test(password) ? null : { complexity: true };
  }
  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible; // Inverse l'état de visibilité
  }
  isInvalid(field: AbstractControl) {
    return field ? field.invalid && (field.touched || field.dirty) : false;
  }
  isValid(field: AbstractControl) {
    return field ? field.valid && (field.touched || field.dirty) : false;
  }

}
