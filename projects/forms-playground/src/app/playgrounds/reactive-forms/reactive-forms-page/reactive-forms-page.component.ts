import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { UserSkillsService } from '../../../core/user-skills.service';

@Component({
  selector: 'app-reactive-forms-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reactive-forms-page.component.html',
  styleUrls: [
    '../../common-page.scss',
    '../../common-form.scss',
    './reactive-forms-page.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReactiveFormsPageComponent implements OnInit {
  skills$!: Observable<string[]>;
  phoneLabels = ['Main', 'Mobile', 'Work', 'Home'];
  get years() {
    const now = new Date().getUTCFullYear();
    return Array(now - (now - 40)).fill('').map((_, idx) => now - idx);
  }

  form = new FormGroup({
    firstName: new FormControl('Mariia-Olena'),
    lastName: new FormControl('Stus'),
    nickname: new FormControl(''),
    email: new FormControl('mariia.stus@gmail.com'),
    yearOfBirth: new FormControl(this.years[this.years.length - 1], {
      nonNullable: true,
    }),
    passport: new FormControl(''),
    address: new FormGroup({
      fullAddress: new FormControl('', { nonNullable: true }),
      city: new FormControl('', { nonNullable: true }),
      postCode: new FormControl(0, { nonNullable: true }),
    }),
    phones: new FormArray([
      new FormGroup({
        label: new FormControl(this.phoneLabels[0], { nonNullable: true }),
        phone: new FormControl(''),
      }),
    ]),
  });

  constructor(private userSkills: UserSkillsService) {}

  ngOnInit(): void {
    this.skills$ = this.userSkills.getSkills();
  }

  addPhone(): void {
    this.form.controls.phones.insert(
      0,
      new FormGroup({
        label: new FormControl(this.phoneLabels[0], { nonNullable: true }),
        phone: new FormControl(''),
      })
    );
  }

  removePhone(index: number): void {
    this.form.controls.phones.removeAt(index);
  }

  OnSubmit(event: Event): void {
    console.log(this.form.value);
  }
}
