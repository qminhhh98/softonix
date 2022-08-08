import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(
    private energyService: EnergyCalculationService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.categoryForm.controls['power'].disable();
    this.getListCategory();
  }

  initForm(): void {
    this.categoryForm = this.fb.group({
      category: [''],
      hours: [''],
      device: [''],
      power: [''],
    });
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
    this.category.push(new CategoryInfo());
  }

  onClickAddDevice() {
    this.devices.push(new DeviceInfo());
  }

  onChangeCategorySelect(categoryId: any) {
    this.categoryForm.controls['hours'].reset();
    this.categoryForm.controls['device'].reset();
    this.energyService.getCategoryInfo(categoryId).subscribe((res) => {
      this.categoryDetail = res?.body;
      this.deviceList = res?.body?.appliances;
      console.log('1' ,this.deviceList);
    });
  }

  onChangeDeviceSelect(power: any) {
    this.categoryForm.controls['power'].setValue(power);
  }
}
