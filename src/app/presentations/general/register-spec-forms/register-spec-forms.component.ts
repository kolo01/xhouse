import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseServicesService } from '../../../core/services/baseServices/base-services.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register-spec-forms',
  standalone: true,
  imports: [],
  templateUrl: './register-spec-forms.component.html',
  styleUrl: './register-spec-forms.component.scss'
})
export class RegisterSpecFormsComponent {

  password: string = "";
    username: string = "";
    first_name: string = "";
    last_name: string = "";
    email: string = "";
    phone_number: string = "";
    cards_type: string = "";
    num_cni: string = "";
    user_type: string = "";



  onKey(event: any, type: string) {
    if (type === 'password') {
        this.password = event.target.value;

    } else if (type === 'username') {
        this.username = event.target.value;
    }
    else if (type === 'first_name') {
      this.first_name = event.target.value;
  }
  else if (type === 'last_name') {
    this.last_name = event.target.value;
}
else if (type === 'email') {
  this.email = event.target.value;
}
else if (type === 'phone_number') {
  this.phone_number = event.target.value;
}
else if (type === 'cards_type') {
  this.cards_type = event.target.value;
}
else if (type === 'num_cni') {
  this.num_cni = event.target.value;
}
 else if (type === 'user_type') {
        this.user_type = event.target.value;
    }
  }




  constructor(private router: Router, private baseService : BaseServicesService, private http: HttpClient) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.handleSubmit
  }




  handleSubmit() {
    console.log("debut")
    throw new Error("hemmmo")
  //   this.baseService.post("users",data).subscribe((res:any)=>{
  //     console.log(res);
  //     this.router.navigate(['/otp_validator']);
  //   },
  // (error:any) => {
  //   console.log(error);
  // })




  }
}
