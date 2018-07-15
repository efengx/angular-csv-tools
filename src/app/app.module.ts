import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
// 引入HttpClient模块
import { HttpClientModule } from '@angular/common/http';
// 引入表单模块部分
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// 导入MaterialModule
import { MaterialModule } from './material.module';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule,
   MatTableModule, MatPaginatorModule, MatSortModule } from '@angular/material';

// 导入路由模块
import { AppRoutingModule } from './app-routing.module';

// 导入组件
import { AppComponent } from './app.component';
// import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { TableComponent } from './components/table/table.component';
import { EditComponent } from './components/edit/edit.component';
import { DialogComponent } from './components/dialog/dialog.component';

// 引入服务
import { CollegeDataService } from './service/college-data.service';





@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TableComponent,
    DialogComponent,
    EditComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MaterialModule,
    AppRoutingModule
  ],
  providers: [
    CollegeDataService,
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent],
  // 引入摸版没有直接引用的组件，而是动态调用的，比如说各种弹窗
  entryComponents: [
    DialogComponent,
  ],
})
export class AppModule { }
