import { CanActivateFn, Router } from '@angular/router';
import { AuthentificationService } from '../../services/authenticate/authentification.service';
import { inject } from '@angular/core';
import { BaseServicesService } from '../../services/baseServices/base-services.service';

export const authGuard: CanActivateFn = (route, state) => {
  // Implement your authentication logic here
  // Return true if the user is authenticated, otherwise return false
  // For example, you can check if the user's token is valid or if they have permission to access the route
  const router = inject(Router);
  const token = inject(AuthentificationService);
  const baseService = inject(BaseServicesService)

  if(token.isAuhenticate()){


    baseService.post('token/verify',{token: token.getToken()}).subscribe((res: any) => {
        console.log('Access granted');
      },(err: any)=>
      {
        baseService.post('token/refresh',{refresh: token.getRefresh()}).subscribe((res: any) => {
            console.log(res)
            localStorage.setItem('isConnected',res)

          },
          (err: any)=>
          {
            localStorage.clear();
            router.navigateByUrl('/login')
          }
        )
      }
    )
    return true
  }
  router.navigateByUrl('/login')
  return false;


};
