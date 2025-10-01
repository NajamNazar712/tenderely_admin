import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'ngx-kyb-action-buttons',
  template: `
    <div class="btns">
      <!-- <button nbButton size="tiny" ghost status="info" (click)="emit('view')" nbTooltip="View document">
        <i class="nb-search"></i>
      </button> -->
      <button nbButton size="tiny" ghost status="success" (click)="emit('approve')" nbTooltip="Approve">
        <i class="nb-checkmark"></i>
      </button>
      <button nbButton size="tiny" ghost status="danger" (click)="emit('reject')" nbTooltip="Reject">
        <i class="nb-close"></i>
      </button>
    </div>
  `,
  styles: [`
    .btns { display:flex; gap:6px; align-items:center; }
    .btns i { font-size: 1.5rem; line-height: 1; } /* 👈 bigger icons */
    :host { display:block; }
  `],
})
export class ActionButtonsComponent {
  rowData: any; // ng2-smart-table injects this

  @Output() action = new EventEmitter<{ type: 'view'|'approve'|'reject', row: any }>();

  emit(type: 'view'|'approve'|'reject') {
    this.action.emit({ type, row: this.rowData });
  }
}
