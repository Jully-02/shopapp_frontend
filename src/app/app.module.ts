import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { DetailProductComponent } from './components/detail-product/detail-product.component';
import { OrderComponent } from './components/order/order.component';
import { OrderDetailComponent } from './components/order-confirm/order-detail.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { 
  HttpClientModule, 
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app/app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AdminComponent } from './components/admin/admin.component';
import { OrderAdminComponent } from './components/admin/order/order.admin.component';
import { ProductAdminComponent } from './components/admin/product/product.admin.component';
import { CategoryAdminComponent } from './components/admin/category/category.admin.component';
import { AdminModule } from './components/admin/admin.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    HeaderComponent,
    HomeComponent,
    FooterComponent,
    DetailProductComponent,
    OrderComponent,
    OrderDetailComponent,
    LoginComponent,
    RegisterComponent,
    AppComponent,
    UserProfileComponent,
    // AdminComponent,
    // OrderAdminComponent,
    // ProductAdminComponent,
    // CategoryAdminComponent,
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    AdminModule,
    CommonModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    }
  ],
  bootstrap: [
    AppComponent,
    // HomeComponent,
    // DetailProductComponent,
    // OrderComponent,
    // OrderDetailComponent,
    // LoginComponent,
    // RegisterComponent,
    // UserProfileComponent
  ]
})
export class AppModule { }
