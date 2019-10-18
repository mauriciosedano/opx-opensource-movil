import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'proyectos',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../proyectos/proyectos.module').then(m => m.ProyectosPageModule)
          }
        ]
      },
      {
        path: 'tareas',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tareas/tareas.module').then(m => m.TareasPageModule)
          }
        ]
      },
      {
        path: 'ajustes',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../perfil/perfil.module').then(m => m.PerfilPageModule)
          }
        ]
      }, {
        path: 'notificaciones',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../notificaciones/notificaciones.module').then(m => m.NotificacionesPageModule)
          }
        ]
      },
      {
        path: 'explorar',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../explorar/explorar.module').then(m => m.ExplorarPageModule)
          }
        ]
      }, {
        path: '',
        redirectTo: '/tabs/explorar',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/explorar',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
