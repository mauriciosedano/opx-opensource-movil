import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ApiRestService } from './services/api-rest.service';

const routes: Routes = [
  { path: '', loadChildren: './login/login.module#LoginPageModule'},
  {path: 'login', redirectTo: '', pathMatch: 'full'},
  { path: 'proyectos', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'proyecto/:id', loadChildren: './detalle-proyecto/detalle-proyecto.module#DetalleProyectoPageModule' },
  { path: 'tareas', loadChildren: './tareas/tareas.module#TareasPageModule' },
  { path: 'perfil', loadChildren: './perfil/perfil.module#PerfilPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  providers: [ApiRestService]
})
export class AppRoutingModule { }
