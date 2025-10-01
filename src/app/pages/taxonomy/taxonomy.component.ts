import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { Subject} from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';


import { AdminTaxonomyService, ModelType, Category, SubCat } from '../../services/admin-taxonomy.service';

@Component({
  selector: 'ngx-app-admin-taxonomy',
  templateUrl: './taxonomy.component.html',
  styleUrls: ['./taxonomy.component.scss']
})
export class TaxonomyComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  modelTypes: ModelType[] = [];
  categories: Category[] = [];
  subcategories: SubCat[] = [];
categoriesForCatForm: Category[] = [];   // show existing categories for selected module in Add Category
  loadingCatsForCatForm = false;
  loadingCats = false;
  loadingSubs = false;

  catForm = this.fb.group({
    modelName: ['', Validators.required],
    categoryName: ['', [Validators.required, Validators.maxLength(80)]],
  });

  subForm = this.fb.group({
    modelName: ['', Validators.required],        // to filter categories
    categoryId: ['', Validators.required],
    subCategoryName: ['', [Validators.required, Validators.maxLength(80)]],
  });

  constructor(
    private fb: FormBuilder,
    private api: AdminTaxonomyService,
    private toast: NbToastrService
  ) {}

  ngOnInit(): void {
    this.api.getModelTypes().pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => this.modelTypes = res.modelTypes || [],
        error: _ => this.toast.danger('Failed to load modules', 'Error'),
      });


    this.catForm.get('modelName')!.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        switchMap(modelName => {
          // reset UI & disable name while loading/empty
          this.loadingCatsForCatForm = !!modelName;
          this.categoriesForCatForm = [];
          const nameCtrl = this.catForm.get('categoryName')!;
          nameCtrl.disable({ emitEvent: false });
          nameCtrl.reset('', { emitEvent: false });
          if (!modelName) return []; // no request
          return this.api.getCategories(modelName as string);
        })
      )
      .subscribe((res: any) => {
        if (!res) return;
        this.categoriesForCatForm = res.categories || [];
        this.loadingCatsForCatForm = false;
        // enable name input once a module is chosen (even if 0 categories exist)
        this.catForm.get('categoryName')!.enable({ emitEvent: false });
      });

    // when subForm.modelName changes → load categories for that model
    this.subForm.get('modelName')!.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        switchMap(modelName => {
          this.loadingCats = true;
          this.subForm.patchValue({ categoryId: '' }, { emitEvent: false });
          this.subcategories = [];
          return this.api.getCategories(modelName as string);
        })
      )
      .subscribe({
        next: res => { this.categories = res.categories || []; this.loadingCats = false; },
        error: _ => { this.loadingCats = false; this.toast.danger('Failed to load categories', 'Error'); },
      });

    // when category changes → load subcategories
    this.subForm.get('categoryId')!.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        switchMap(catId => {
          if (!catId) { this.subcategories = []; return []; }
          this.loadingSubs = true;
          return this.api.getSubcategories(catId as string);
        })
      )
      .subscribe((res: any) => {
        if (!res) return;
        this.subcategories = res.subcategories || [];
        this.loadingSubs = false;
      });
  }

  createCategory() {
    if (this.catForm.invalid) return this.catForm.markAllAsTouched();
    const payload = this.catForm.getRawValue() as { modelName: string; categoryName: string };

    this.api.addCategory(payload).subscribe({
      next: _ => {
        this.toast.success('Category Added', 'Success');
        const modelName = payload.modelName;

        // Clear only the name field
        this.catForm.patchValue({ categoryName: '' }, { emitEvent: false });

        // Refresh the "existing categories" list in Add Category panel
        this.api.getCategories(modelName).subscribe(r => this.categoriesForCatForm = r.categories || []);

        // If Subcategory panel is on same module, refresh its categories too
        if (this.subForm.value.modelName === modelName) {
          this.api.getCategories(modelName).subscribe(r => {
            this.categories = r.categories || [];
            const catCtrl = this.subForm.get('categoryId')!;
            if (this.categories.length) catCtrl.enable({ emitEvent: false });
          });
        }
      },
      error: err => this.toast.danger(err?.error?.message || 'Failed to add category', 'Error'),
    });
  }

  createSubCategory() {
    if (this.subForm.invalid) return this.subForm.markAllAsTouched();
    const payload = {
      categoryId: this.subForm.value.categoryId!,
      subCategoryName: this.subForm.value.subCategoryName!,
    };
    this.api.addSubCategory(payload).subscribe({
      next: _ => {
        this.toast.success('success', 'Subcategory Added');
        const catId = this.subForm.value.categoryId!;
        this.subForm.patchValue({ subCategoryName: '' });
        this.api.getSubcategories(catId).subscribe(r => this.subcategories = r.subcategories || []);
      },
      error: err => this.toast.danger(err?.error?.message || 'Failed to add subcategory', 'Error'),
    });
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}
