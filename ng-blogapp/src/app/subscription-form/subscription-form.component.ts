import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubsciptService } from '../services/subscipt.service';
import { ISubscript } from '../models/subscript';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subscription-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './subscription-form.component.html',
  styleUrl: './subscription-form.component.scss'
})
export class SubscriptionFormComponent implements OnInit {

  subscriptForm!: FormGroup;
  isEmailError: boolean = false;
  isSubscribed: boolean = false;

  constructor(private fb: FormBuilder, private subscriptService: SubsciptService) { }

  ngOnInit(): void {
    this.subscriptForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onValidateField(field: string, type: string) {
    return (this.subscriptForm.controls[field].errors?.[type] && 
          this.subscriptForm.controls[field].touched && 
          this.subscriptForm.controls[field].invalid)
  }

  onSubmit() {
    const data: ISubscript = {
      name: this.subscriptForm.value.name,
      email: this.subscriptForm.value.email,
      createdAt: new Date(),
    }

    this.subscriptService.checKSubsEmail(data.email).then((value) => {
      if (value.empty) {
        this.subscriptService.addSubscription(data);
        this.isSubscribed = true;
        this.subscriptForm.reset();
      } else {
        this.isEmailError = true;
      }
    })
  }
}