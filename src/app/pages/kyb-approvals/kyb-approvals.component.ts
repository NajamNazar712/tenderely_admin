import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminKybService, KybItem } from '../../services/admin-kyb.service';
import { NbToastrService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { Subject } from 'rxjs';
import {takeUntil, finalize } from 'rxjs/operators';
import { ActionButtonsComponent } from './action-buttons.component';

@Component({
  selector: 'ngx-app-kyb-approvals',
  templateUrl: './kyb-approvals.component.html',
  styleUrls: ['./kyb-approvals.component.scss'],
})
export class KybApprovalsComponent implements OnInit, OnDestroy {
  loading = false;
  source = new LocalDataSource();
  rawItems = [];
  private destroy$ = new Subject<void>();
actionLoadingId: string | null = null;
  settings = {
    actions:false,
    pager: {
      perPage: 10,   // built-in pagination
    },
    columns: {
      companyName: {
        title: 'Company',
        type: 'string',
        filter: false,
      },
      verificationDocumentName: {
        title: 'Document',
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell: string, row: any) => {
            if (!row?.verificationDocumentUrl) return '—';
            const name = (cell && cell.trim()) ? cell : 'View';
            const safeName = name.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const safeUrl  = String(row.verificationDocumentUrl).replace(/"/g, '&quot;');
            return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${safeName}</a>`;
        },
      },
      industry: {
        title: 'Industry',
        type: 'string',
        filter: false,
      },
    //   country: {
    //     title: 'Country',
    //     type: 'string',
    //     filter: false,
    //   },
      submittedByName: {
        title: 'Submitted By',
        type: 'string',
        filter: false,
      },
      submittedByEmail: {
        title: 'Email',
        type: 'string',
        filter: false,
      },
      verificationUploadedAt: {
        title: 'Submitted At',
        type: 'string',
        filter: false,
        valuePrepareFunction: (val: string) => new Date(val).toLocaleString(),
      },
       _actions: {
        title: 'Actions',
        type: 'custom',
        filter: false,
        renderComponent: ActionButtonsComponent,
        onComponentInitFunction: (instance: ActionButtonsComponent) => {
          instance.action.subscribe(({ type, row }) => this.handleRowAction(type, row));
        },
        width: '150px',
      },
    },
  };

  constructor(
    private api: AdminKybService,
    private toast: NbToastrService,
  ) {}

  ngOnInit(): void {
    this.fetch();
      //this.loadDummy();
  }

    fetch() {
        this.loading = true;
        this.api.getPending()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
            next: (res) => {
                this.rawItems = res || [];
                const mapped = this.rawItems.map(i => ({
                ...i,
                submittedByName: i.submittedBy?.fullName || '—',
                submittedByEmail: i.submittedBy?.email || '—',
                }));
                this.source.load(mapped);
                this.loading = false;
            },
            error: _ => {
                this.loading = false;
                this.toast.danger('Failed to load pending KYB items', 'Error');
            },
        });
    }


  // Handle custom actions from table
 
handleRowAction(type: 'view'|'approve'|'reject', row: any) {
    if (type === 'view') {
        if (row?.verificationDocumentUrl) window.open(row.verificationDocumentUrl, '_blank');
        else this.toast.warning('No document URL on this row');
        return;
    }

    if (!row?._id) {
        this.toast.danger('Missing row id', 'Error');
        return;
    }

    this.actionLoadingId = row._id;

    const req$ = type === 'approve'
        ? this.api.approveKyb(row._id)                 // PUT /api/kyb/:id/approve
        : this.api.rejectKyb(row._id);                 // PUT /api/kyb/:id/reject

    req$.pipe(finalize(() => (this.actionLoadingId = null))).subscribe({
        next: _ => {
        if (type === 'approve') this.toast.success('Approved', row.companyName || '');
        else this.toast.warning('Rejected', row.companyName || '');
        this.fetch(); // reload fresh data
        },
        error: _ => this.toast.danger(`Failed to ${type}`, 'Error'),
    });
}

  private removeRow(row: any) {
    this.source.remove(row);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

    // loadDummy() {
    //     const dummy: any[] = [
    //         {
    //         _id: 'c1',
    //         companyName: 'Acme Logistics',
    //         documentId: 'd1',
    //         documentUrl: 'https://example.com/docs/acme-reg.pdf',
    //         fileType: 'application/pdf',
    //         submittedBy: { _id: 'u1', fullName: 'Alice Khan', email: 'alice@example.com' },
    //         submittedAt: new Date().toISOString(),
    //         status: 'pending',
    //         },
    //         {
    //         _id: 'c2',
    //         companyName: 'Blue Steel LLC',
    //         documentId: 'd2',
    //         documentUrl: 'https://example.com/docs/blue-steel.jpg',
    //         fileType: 'image/jpeg',
    //         submittedBy: { _id: 'u2', fullName: 'Bob Lee', email: 'bob@example.com' },
    //         submittedAt: new Date(Date.now() - 3600_000).toISOString(),
    //         status: 'pending',
    //         },
    //         {
    //         _id: 'c3',
    //         companyName: 'Nova Traders',
    //         documentId: 'd3',
    //         documentUrl: 'https://example.com/docs/nova.pdf',
    //         fileType: 'application/pdf',
    //         submittedBy: { _id: 'u3', fullName: 'Carla Dias', email: 'carla@example.com' },
    //         submittedAt: new Date(Date.now() - 7200_000).toISOString(),
    //         status: 'pending',
    //         },
    //         {
    //         _id: 'c4',
    //         companyName: 'Green Leaf Co.',
    //         documentId: 'd4',
    //         documentUrl: 'https://example.com/docs/greenleaf.png',
    //         fileType: 'image/png',
    //         submittedBy: { _id: 'u4', fullName: 'Danish Ali', email: 'danish@example.com' },
    //         submittedAt: new Date(Date.now() - 86400_000).toISOString(),
    //         status: 'pending',
    //         },
    //         {
    //         _id: 'c5',
    //         companyName: 'Sunrise Imports',
    //         documentId: 'd5',
    //         documentUrl: 'https://example.com/docs/sunrise.pdf',
    //         fileType: 'application/pdf',
    //         submittedBy: { _id: 'u5', fullName: 'Emily Wong', email: 'emily@example.com' },
    //         submittedAt: new Date(Date.now() - 172800_000).toISOString(),
    //         status: 'pending',
    //         },
    //     ];

    //     // Map to the columns your table expects
    //     const mapped = dummy.map(i => ({
    //         ...i,
    //         submittedByName: i.submittedBy?.fullName || '—',
    //         submittedByEmail: i.submittedBy?.email || '—',
    //     }));

    //     this.source.load(mapped);
    // }
}
