import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";
import { UserService } from '../../../core/services/userService/user.service';
import { AuthentificationService } from '../../../core/services/authenticate/authentification.service';
import { BaseServicesService } from '../../../core/services/baseServices/base-services.service';
import { User } from '../../../domains/interfaces/user';
import { FooterComponent } from "../footer/footer.component";
import { LocalStorageServiceService } from '../../../core/services/allOthers/local-storage-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profils',
  standalone: true,
  imports: [ReactiveFormsModule, NavbarComponent, FooterComponent],
  templateUrl: './profils.component.html',
  styleUrl: './profils.component.scss'
})
export class ProfilsComponent implements OnInit {
  email = "konedieu5@gmail.com";
  username= "Noobs225"
  avatar: string = ''

  profileForm!: FormGroup

  changePasswordForm!: FormGroup

  constructor(private token: AuthentificationService, private baseServive: BaseServicesService, private localStore: LocalStorageServiceService, private toastr: ToastrService) {}

  data!: User

  ngOnInit(): void {
    const userId = this.token.decodedToken().user_id
    this.baseServive.getAllWithToken('user/profile').subscribe({
      next: (response:User) => {
        console.log(response);
        this.data = response;

        this.profileForm = new FormGroup({
          username: new FormControl(response.username),
          first_name: new FormControl(response.firstName),
          last_name: new FormControl(response.lastName),
          cards_type: new FormControl(response.cardType),
          num_cni: new FormControl(response.num_cni),
          image_recto: new FormControl(response.image_recto),
          image_verso: new FormControl(response.image_verso),
          avatar: new FormControl(response.avatar),
        });

        this.username = response.username
        this.avatar = response.avatar ? response.avatar : "https://th.bing.com/th/id/R.2701098040be871e37311fb63896bf21?rik=cYuH5UoZJc0sbA&pid=ImgRaw&r=0"
        this.email = response.email
      },
      error: (error) => {
        console.error('Error submitting form!', error);
        this.toastr.error('Veuillez vous reconnecter', "Erreur detectée")
        this.localStore.clear()
        window.location.href= "/login"
      },
    })

    this.changePasswordForm = new FormGroup({
      current_password: new FormControl(''),
      new_password: new FormControl(''),
      confirm_new_password: new FormControl(''),
    })

  }

  saveData(){
    console.log(this.profileForm.value)
    this.baseServive.patch('users/update-profile', this.profileForm.value).subscribe({
      next: (response) => {
        console.log(response);
        window.location.href = "/profils"
      },
      error: (error) => {
        console.error('Error submitting form!', error);
      },
    })
  }

  saveDataPassword(){
    console.log(this.changePasswordForm.value)
    if (this.changePasswordForm.value.new_password === this.changePasswordForm.value.confirm_new_password) {
      const data = {
        old_password: this.changePasswordForm.value.current_password,
        password: this.changePasswordForm.value.new_password
      }
      this.baseServive.putWithTokenWithoutId('users/change-password', data).subscribe({
        next: (response) => {
          console.log(response);
          this.changePasswordForm.reset();
          this.localStore.clear()
        },
        error: (error) => {
          console.error('', error);
        },
      })
    } else {
      alert('mot de passe non conforme')
    }
  }

}
