import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { UserSkillsService } from '../../../core/user-skills.service';
import { banWords } from '../validators/ban-words.validator';
import { password } from '../validators/password.validator';

@Component({
  selector: 'app-reactive-forms-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reactive-forms-page.component.html',
  styleUrls: ['../../common-page.scss', '../../common-form.scss', './reactive-forms-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReactiveFormsPageComponent implements OnInit {
  skills$!: Observable<string[]>;
  phoneLabels = ['Main', 'Mobile', 'Work', 'Home'];
  get years() {
    const now = new Date().getUTCFullYear();
    return Array(now - (now - 40))
      .fill('')
      .map((_, idx) => now - idx);
  }

  form = this.fb.group({
    firstName: ['Mariia-Olena', [Validators.required, Validators.minLength(2), banWords(['test', 'admin', 'user'])]],
    lastName: ['Stus', [Validators.required, Validators.minLength(2)]],
    nickname: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[\w.]+$/)]],
    email: ['mariia.stus@gmail.com', [Validators.required, Validators.email]],
    yearOfBirth: this.fb.nonNullable.control(this.years[this.years.length - 1], [Validators.required]),
    passport: ['', [Validators.pattern(/^[A-Z]{2}[0-9]{6}$/)]],
    address: this.fb.nonNullable.group({
      fullAddress: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postCode: [0, [Validators.required]],
    }),
    phones: this.fb.array([
      this.fb.group({
        label: this.fb.nonNullable.control(this.phoneLabels[0]),
        phone: '',
      }),
    ]),
    skills: this.fb.record<boolean>({}),
    password: this.fb.nonNullable.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: '',
    }, { validators: password })
  });

  constructor(private fb: FormBuilder, private userSkills: UserSkillsService) {}

  ngOnInit(): void {
    this.skills$ = this.userSkills.getSkills().pipe(tap((skills) => this.buildSkillControls(skills)));
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

  private buildSkillControls(skills: string[]) {
    skills.forEach((skill) => {
      this.form.controls.skills.addControl(skill, new FormControl(false, { nonNullable: true }));
    });
  }

  OnSubmit(event: Event): void {
    console.log(this.form.value);
  }
}
