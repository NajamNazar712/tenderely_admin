import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NbCardModule, NbInputModule, NbButtonModule, NbLayoutModule } from '@nebular/theme';
import { LoginComponent } from './login.component';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: 'login', component: LoginComponent }]),
    NbCardModule,
    NbInputModule,
    NbButtonModule,
    NbLayoutModule,
  ]
})
export class AuthModule {}
