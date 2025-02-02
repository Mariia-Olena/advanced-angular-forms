import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IUserInfo } from '../../../core/user-info.interface';

@Component({
  selector: 'app-template-forms-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './template-forms-page.component.html',
  styleUrls: [
    '../../common-page.scss',
    '../../common-form.scss',
    './template-forms-page.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateFormsPageComponent implements OnInit {

  userInfo: IUserInfo = {
    firsName: '',
    lastName: '',
    nickname: '',
    email: '',
    yearOfBirth: 0,
    passport: '',
    fullAddress: '',
    city: '',
    postCode: ''
  }

  constructor() { }

  get years() {
    const now = new Date().getUTCFullYear();
    return Array(now - (now - 40)).fill('').map((_, idx) => now - idx);
  }

  ngOnInit(): void {
  }

  onSubmitForm(form: NgForm, event: Event) {
    console.log('The form has been submitted', form.value);
    console.log('The form submit event', event);
    
    this.userInfo = {
      firsName: '',
      lastName: '',
      nickname: '',
      email: '',
      yearOfBirth: 0,
      passport: '',
      fullAddress: '',
      city: '',
      postCode: ''
    }
  }
}
