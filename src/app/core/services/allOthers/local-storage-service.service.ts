import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageServiceService {

/// service pour bypasser la restriction de localstorage, en attendant d'avoir une autre solution



   // Méthode pour stocker des données
   setItem(key: string, value: any): void {

      localStorage.setItem(key, value);

  }

  // Méthode pour récupérer des données
  getItem(key: string): string | null {

      return localStorage.getItem(key);

  }

  // Méthode pour supprimer des données
  removeItem(key: string): void {

      localStorage.removeItem(key);

  }

  // Méthode pour vider le localStorage
  clear(): void {

      localStorage.clear();

  }
}
