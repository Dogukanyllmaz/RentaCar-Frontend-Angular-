import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Customer } from 'src/app/models/customer';
import { CustomerService } from 'src/app/services/customer.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css'],
})
export class CustomerDetailComponent implements OnInit {
  customer: Customer[];
  customerUpdateForm: FormGroup;
  constructor(
    private customerService: CustomerService,
    private toastrService: ToastrService,
    private localStorageService: LocalStorageService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCustomeByUserId();
    this.createUpdateForm();
  }

  createUpdateForm() {
    this.customerUpdateForm = this.formBuilder.group({
      userId: [
        this.localStorageService.get('userId'),
        Validators.nullValidator,
      ],
      customerId: [
        this.localStorageService.get('customerId'),
        Validators.nullValidator,
      ],
      companyName: [
        this.localStorageService.get('companyName'),
        Validators.required,
      ],
    });
  }
  getCustomeByUserId() {
    this.customerService
      .getCustomerByUserId(Number(this.localStorageService.get('userId')))
      .subscribe((response) => {
        this.customer = response.data;
        response.data.forEach((customer) => {
          this.localStorageService.add('customerId', customer.userId);
          this.localStorageService.add('companyName', customer.companyName);
        });
      });
  }

  update() {
    if (this.customerUpdateForm.valid) {
      let customerModel = Object.assign({}, this.customerUpdateForm.value);
      customerModel.userId = Number(customerModel.userId);
      customerModel.customerId = Number(customerModel.customerId);
      this.toastrService.success('Güncellendi', 'Başarılı');
      this.customerService.update(customerModel).subscribe((response) => {
        this.toastrService.success(response.message, 'Başarılı');
      });
    } else {
      this.toastrService.error('Lütfen Zorunlu Alanları Doldurun', 'Dikkat');
    }
  }
}
