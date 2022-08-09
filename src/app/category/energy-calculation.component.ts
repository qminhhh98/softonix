import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
  deviceHours: any;

  emailForm!: FormGroup;
  public emailLabels = ['Home', 'Work', 'Other'];

  constructor(
    private energyService: EnergyCalculationService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    //this.categoryForm.controls['power'].disable();
    this.getListCategory();
  }

  initForm(): void {
    this.categoryForm = this.fb.group({
      category: this.fb.array([]),
    });
  }

  newData() : FormGroup{
    return this.fb.group({
      category: [''],
      hours: [''],
      device: [''],
      power: [''],
    });
  }

  get dataCategory(): FormArray {
    return this.categoryForm.get('category') as FormArray;
  }

  get fc() {
    return this.categoryForm.controls;
  }

  getListCategory() {
    this.energyService.getListCategory().subscribe((res) => {
      this.listCategory = res.body;
    });
  }

  onClickAddCategory() {
    const categories = this.categoryForm.controls['category'] as FormArray;
    // this.category.push(new CategoryInfo());
    // this.dataTA.push(this.newData());
    categories.push(this.fb.group({
      category: [''],
      hours: [''],
    }))
  }

  onClickAddDevice() {
    this.devices.push(new DeviceInfo());
    console.log('1', this.categoryForm.value);
  }

  onChangeCategorySelect(categoryId: any) {
    this.categoryForm.controls['hours'].reset();
    this.categoryForm.controls['device'].reset();
    this.energyService.getCategoryInfo(categoryId).subscribe((res) => {
      this.categoryDetail = res?.body;
      this.deviceList = res?.body?.appliances;
    });
  }

  onChangeDeviceSelect(power: any) {
    this.categoryForm.controls['power'].setValue(power);
  }

  onChangeHours(power: any) {
    this.deviceHours = this.categoryForm.controls['hours'].value;
  }
}
