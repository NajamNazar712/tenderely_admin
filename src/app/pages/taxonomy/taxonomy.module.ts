// taxonomy.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NbCardModule } from '@nebular/theme';
import { NbSelectModule } from '@nebular/theme';
import { NbInputModule } from '@nebular/theme';
import { NbButtonModule } from '@nebular/theme';

import { TaxonomyComponent } from './taxonomy.component';

// const routes: Routes = [
//   { path: '', component: TaxonomyComponent },
// ];
@NgModule({
  declarations: [TaxonomyComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // Nebular UI pieces used in the template:
    NbCardModule,
    NbSelectModule,   // <-- for <nb-select> and <nb-option>
    NbInputModule,    // <-- for nbInput on <input>
    NbButtonModule,   // <-- for nbButton on <button>
  ],
  exports: [TaxonomyComponent],
})
export class TaxonomyModule {}
