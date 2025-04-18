import { Routes } from '@angular/router';

export const routes: Routes = [
    {path:'',loadComponent:()=>import('./home/home.component').then(m=>m.HomeComponent)},
    {path:'settings',loadComponent:()=>import('./settings/settings.component').then(m=>m.SettingsComponent)},

];
