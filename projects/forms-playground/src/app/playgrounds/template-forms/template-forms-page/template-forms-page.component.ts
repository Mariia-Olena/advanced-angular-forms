import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IUserInfo } from '../../../core/user-info.interface';
import { BanWordsDirective } from '../validators/ban-words.directive';
import { PasswordShouldMatchDirective } from '../validators/password-should-match.directive';
import { UniqueNicknameDirective } from '../validators/unique-nickname.directive';

@Component({
  selector: 'app-template-forms-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BanWordsDirective,
    PasswordShouldMatchDirective,
    UniqueNicknameDirective,
  ],
  templateUrl: './template-forms-page.component.html',
  styleUrls: [
    '../../common-page.scss',
    '../../common-form.scss',
    './template-forms-page.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateFormsPageComponent implements OnInit, AfterViewInit {
  @ViewChild(NgForm) formDir!: NgForm;

  private initialFormValues: unknown;
  userInfo: IUserInfo = {
    firsName: 'Mariia-Olena',
    lastName: 'Stus',
    nickname: 'Mariia-Olena',
    email: 'mariia.stus@gmail.com',
    yearOfBirth: 1995,
    passport: 'AA111111',
    fullAddress: '',
    city: '',
    postCode: '',
    password: '',
    confirmPassword: '',
  };

  constructor() {}

  get years() {
    const now = new Date().getUTCFullYear();
    return Array(now - (now - 40))
      .fill('')
      .map((_, idx) => now - idx);
  }

  get isAdult() {
    const currentYear = new Date().getFullYear();
    return currentYear - this.userInfo.yearOfBirth >= 18;
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    queueMicrotask(() => {
      this.initialFormValues = this.formDir.value;
    })
  }

  onSubmitForm(event: Event) {
    this.formDir.resetForm(this.formDir.value);
    this.initialFormValues = this.formDir.value;
  }

  onReset(e: Event) {
    e.preventDefault();
    this.formDir.resetForm(this.initialFormValues);
  }
}
