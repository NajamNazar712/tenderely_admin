import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  NbCardModule,
  NbButtonModule,
  NbBadgeModule,
  NbToastrModule,
  NbSpinnerModule,
  NbInputModule,
  NbIconModule,
  NbTooltipModule,
} from '@nebular/theme';

import { RouterModule, Routes } from '@angular/router';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { KybApprovalsComponent } from './kyb-approvals.component';
import { ActionButtonsComponent } from './action-buttons.component';

const routes: Routes = [
  { path: '', component: KybApprovalsComponent },
];

@NgModule({
  declarations: [KybApprovalsComponent, ActionButtonsComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),

    // Nebular
    NbCardModule,
    NbButtonModule,
    NbBadgeModule,
    NbToastrModule,
    NbSpinnerModule,
    NbInputModule,
    NbIconModule,
    NbTooltipModule,

    // Table
    Ng2SmartTableModule,
  ],
})
export class KybApprovalsModule {}
