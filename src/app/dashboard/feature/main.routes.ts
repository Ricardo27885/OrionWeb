import { Routes } from "@angular/router";
import { AuthGuard } from "../../core/auth.guard";

export default [
    
        {
           
            path: 'usuarios',
            loadComponent: () => import('./main/main.component')
        },
        {
          
            path: 'times',
            loadComponent: () => import('./times/times.component')
        }
          
    
] as Routes