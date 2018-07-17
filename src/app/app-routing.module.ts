import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// 导入组件
// import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { TableComponent } from './components/table/table.component';
import { EditComponent } from './components/edit/edit.component';




const routes: Routes = [
  { path: '', redirectTo: '/home/table/1/大学', pathMatch: 'full' },
  // { path: 'login', component: LoginComponent },
  {
    path: 'home', component: HomeComponent,
    children: [
      {
        path: 'table/:pkid/:name', component: TableComponent
      },
      {
        path: 'edit/:id/:name/:pkid', component: EditComponent
      },
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  // 在提供器里面声明路由守卫
  providers: [
  ]
})
export class AppRoutingModule { }
