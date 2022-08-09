import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryInfo, DeviceInfo } from './energy-calculation.model';
import { EnergyCalculationService } from './energy-calculation.service';

@Component({
  selector: 'app-energy-calculation',
  templateUrl: './energy-calculation.component.html',
  styleUrls: ['./energy-calculation.component.scss'],
})
export class EnergyCalculationComponent implements OnInit {
  count: any = 0;
  category: CategoryInfo[] = [];
  devices: DeviceInfo[] = [];
  listCategory: any;
  categoryDetail: any;
  deviceList: any;
  categoryForm!: FormGroup;
  categoriesArrayForm!: FormArray;


  constructor(
    private energyService: EnergyCalculationService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
    //this.categoryForm.controls['power'].disable();
    this.getListCategory();
  }

  initForm(): void {
    this.categoryForm = this.fb.group({
      // category: [''],
      // hours: [''],
      // device: [''],
      // power: [''],
      categories: new FormArray([])
    });
  }

  get fc() {
    return this.categoryForm.controls;
  }

  get categoryControls() {
    return (this.categoryForm.get('categories') as FormArray).controls;
  }

  getListCategory() {
    this.energyService.getListCategory().subscribe((res) => {
      this.listCategory = res.body;
    });
  }

  onClickAddCategory() {
    this.categoriesArrayForm = this.categoryForm.get('categories') as FormArray;
    this.categoriesArrayForm.push(this.createCategoryForm());
  }

  createCategoryForm(): FormGroup {
    return this.fb.group({
      category: [''],
      hours: ['']
    });
  }
  onClickAddDevice() {
    this.devices.push(new DeviceInfo());

  }

  onChangeCategorySelect(categoryId: any, formCategoryIndex: number) {
    const categoryControl = this.categoriesArrayForm.at(formCategoryIndex) as FormGroup;
    console.log('aloo', categoryControl);
    // this.categoryForm.controls['hours'].reset();
    // this.categoryForm.controls['device'].reset();

    categoryControl.controls['hours'].reset();

    this.energyService.getCategoryInfo(categoryId).subscribe((res) => {
      this.categoryDetail = res?.body;
      this.deviceList = res?.body?.appliances;
      console.log('1', this.deviceList);
    });
  }

  onChangeDeviceSelect(power: any) {
    this.categoryForm.controls['power'].setValue(power);
  }
}
