import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './login/login.module#LoginPageModule'},
  { path: 'proyectos', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'proyecto/:id', loadChildren: './detalle-proyecto/detalle-proyecto.module#DetalleProyectoPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
