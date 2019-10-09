import { RouterModule, Routes } from '@angular/router';
import { PagesPage } from './pages.page';

const pagesRoutes: Routes = [{
    path: '',
    component: PagesPage,
    children: [{
        path: '',
        loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
    }]
}];

export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes);
