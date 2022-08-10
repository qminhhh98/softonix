import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { combineLatest, distinctUntilChanged, map, of } from 'rxjs';
import { CATEGORY_FIELDS } from './energy-calculation-form-field.constant';
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
  deviceForm!: FormGroup;
  categoriesArrayForm!: FormArray;
  devicesArrayForm!: FormArray;

  newForm!: FormGroup;
  vedqGroup!: FormGroup;
  FormArray = FormArray;
  deviceMap = new Map(); // key=cateId, value: list_deviceID
  totalValue = 0;

  CATEGORY_FIELDS = CATEGORY_FIELDS;

  get vedqCategories(): FormArray {
    return this.vedqGroup.get('categories') as FormArray;
  }

  vedqDeviceByCategoryIndex(index: number): FormArray {
    return this.vedqCategories.at(index).get('devices') as FormArray;
  }

  constructor(
    private energyService: EnergyCalculationService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.registerCalculateTotalAmount();
    this.getListCategory();
  }

  initForm(): void {
    this.vedqGroup = this.fb.group({
      categories: this.fb.array([]),
    });
  }

  vedqCreateCategory(): FormGroup {
    return (this.newForm = this.fb.group({
      [CATEGORY_FIELDS.CATEGORY_ID]: null,
      [CATEGORY_FIELDS.HOUR]: null,
      [CATEGORY_FIELDS.DEVICES]: this.fb.array([]),
    }));
  }

  vedqOnAddNewDevice(): FormGroup {
    return this.fb.group({
      power: null,
      device: null,
      hour: null,
      percent: null,
    });
  }

  vedqOnAddNewCategory() {
    this.vedqCategories.push(this.vedqCreateCategory());
  }

  vedqOnAddDevice(cateIndex: number) {
    (
      ((this.vedqCategories as FormArray).get([cateIndex]) as FormGroup).get(
        'devices'
      ) as FormArray
    ).push(this.vedqOnAddNewDevice());
  }

  registerCalculateTotalAmount() {
    this.vedqCategories.valueChanges
      .pipe(
        map((res) => {
          return res.map((c: any) => c.devices).flat();
        }),
        // only check changes for devices data
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      )
      .subscribe((res: any) => {
        const formValue = JSON.parse(JSON.stringify(res));
        const totalValue = formValue?.reduce((prev: any, curr: any) => {
          return prev + curr.power * (curr.hour ?? 0);
        }, 0);

        // setPercentage forEach item
        formValue.forEach((dev: any) => {
          const currentAmount = (dev.power * dev.hour / totalValue) * 100;
          dev.percent = isNaN(currentAmount) ? 0 : currentAmount.toFixed(2);
        });

        this.totalValue = totalValue;
        // set percent back to formgroup
        let counter = 0;
        this.vedqCategories.controls.forEach((catControl) => {
          (catControl.get('devices') as FormArray).controls.forEach(
            (deviceControl) => {
              deviceControl
                .get('percent')
                ?.setValue(formValue[counter++].percent);
            }
          );
        });
      });
  }

  onDeviceChange(deviceControlIndex: number, cateControlIndex: number) {
    const cateControl = this.vedqCategories.at(cateControlIndex);
    const deviceControl =
      this.vedqDeviceByCategoryIndex(cateControlIndex).at(deviceControlIndex);

    //set power value
    const cateId = cateControl.get('cate')?.value;
    const deviceId = deviceControl.get('device')?.value;
    const foundDevice = this.deviceMap
      .get(cateId)
      .find((d: any) => d.deviceId === deviceId);
    deviceControl?.get('power')?.setValue(foundDevice.power);

    // set min/max validation hour
    const cateConfig = this.listCategory.find(
      (c: any) => c.id === cateControl.get('cate')?.value
    );
    const min = cateConfig?.minHour;
    const max = cateConfig?.maxHour;
    deviceControl
      ?.get('hour')
      ?.setValidators([Validators.min(min), Validators.max(max)]);
  }

  getListCategory() {
    this.energyService.getListCategory().subscribe((res) => {
      this.listCategory = res.body;
    });
  }

  getListCategoryDetails(categoryId: any) {
    this.energyService.getCategoryInfo(categoryId).subscribe((res) => {
      this.categoryDetail = res?.body;
      this.deviceList = res?.body?.appliances;
    });
  }

  onChangeCategory(cateId: any, cateIndex: number) {
    if (!this.deviceMap.has(cateId)) {
      this.energyService.getCategoryInfo(cateId).subscribe((res) => {
        this.deviceMap.set(cateId, res.body.appliances);
      });
    }

    // remove all old device not related to this category
    const listDeviceControl = this.vedqCategories.at(cateIndex).get("devices") as FormArray;
    while(listDeviceControl.length > 0) {
      listDeviceControl.removeAt(0);
    }
  }

  getMinMaxErrorMessage(cateId: number) {
    const cateConfig = this.listCategory.find((c: any) => c.id === cateId);
    const min = cateConfig?.minHour;
    const max = cateConfig?.maxHour;
    return `Value must between ${min} and ${max}.`;
  }
}
