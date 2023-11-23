import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import 'zone.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <p>
      <a href="https://coryrylan.com/blog/creating-a-dynamic-checkbox-list-in-angular">Dynamic Checkbox List with FormBuilder</a>
    </p>

    <form [formGroup]="form" (ngSubmit)="submit()">
      <label formArrayName="orders" *ngFor="let order of ordersFormArray.controls; let i = index">
        <input type="checkbox" [formControlName]="i">
        {{ordersData[i].name}}
      </label>

      <div *ngIf="!form.valid">At least one order must be selected</div>
      <br>
      <button [disabled]="!form.valid">submit</button>
    </form>
  `,
})
export class App {
  form: FormGroup;
  ordersData: any[] = [];

  get ordersFormArray() {
    return this.form.controls['orders'] as FormArray;
  }

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      orders: new FormArray([], minSelectedCheckboxes(1))
    });

    // async orders
    of(this.getOrders()).subscribe(orders => {
      this.ordersData = orders;
      this.addCheckboxes();
    });

    // synchronous orders
    // this.ordersData = this.getOrders();
    // this.addCheckboxes();
  }

  private addCheckboxes() {
    this.ordersData.forEach(() => this.ordersFormArray.push(new FormControl(false)));
  }

  getOrders() {
    return [
      { id: 100, name: 'order 1' },
      { id: 200, name: 'order 2' },
      { id: 300, name: 'order 3' },
      { id: 400, name: 'order 4' }
    ];
  }

  submit() {
    const selectedOrderIds = this.form.value.orders
      .map((checked: boolean, i: number) => checked ? this.ordersData[i].id : null)
      .filter((v: any) => v !== null);

    console.log(selectedOrderIds);
  }
}

function minSelectedCheckboxes(min = 1) {
  const validator: ValidatorFn = (formArray: FormArray) => {
    const totalSelected = formArray.controls
      .map(control => control.value)
      .reduce((prev, next) => next ? prev + next : prev, 0);

    return totalSelected >= min ? null : { required: true };
  };

  return validator;
}

bootstrapApplication(App);
