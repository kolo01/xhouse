import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';



@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, NgIf ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  supportEmail: string = 'support@gestionimmobiliere.com';
  name: string = '';
  email: string = '';
  message: string = '';
  formMessage: string = '';

  submitForm() {
    // Logique pour traiter le formulaire
    if (this.name && this.email && this.message) {
      this.formMessage = 'Votre message a été envoyé avec succès !';
      // Réinitialiser le formulaire
      this.name = '';
      this.email = '';
      this.message = '';
    } else {
      this.formMessage = 'Veuillez remplir tous les champs.';
    }
  }
}
