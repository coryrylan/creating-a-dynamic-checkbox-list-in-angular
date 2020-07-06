import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { of } from 'rxjs';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  form: FormGroup;
  ordersData = [];

  get ordersFormArray() {
    return this.form.controls.orders as FormArray;
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
      .map((checked, i) => checked ? this.ordersData[i].id : null)
      .filter(v => v !== null);

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
