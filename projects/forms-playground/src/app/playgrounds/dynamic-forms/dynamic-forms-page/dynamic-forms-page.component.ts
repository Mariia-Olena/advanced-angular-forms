import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subject, switchMap, tap } from 'rxjs';

import { DynamicControl, DynamicFormConfig } from '../dynamic-forms.model';
import { banWords } from '../../reactive-forms/validators/ban-words.validator';

@Component({
  selector: 'app-dynamic-forms-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-forms-page.component.html',
  styleUrls: ['../../common-page.scss', './dynamic-forms-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormsPageComponent implements OnInit {
  form = new FormGroup({});

  protected formLoadingTrigger = new Subject<'user' | 'company'>();
  protected formConfig$!: Observable<DynamicFormConfig>;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.formConfig$ = this.formLoadingTrigger.pipe(
      switchMap((config) => this.http.get<DynamicFormConfig>(`assets/${config}.form.json`)),
      tap(({ controls }) => this.buildForm(controls)),
    );
  }

  private buildForm(controls: DynamicFormConfig['controls']): void {
    Object.keys(controls).forEach((key) => {
      const validators = this.resolveValidators(controls[key]);
      this.form.addControl(key, new FormControl(controls[key].value, validators));
    });
  }

  private resolveValidators({ validators = {} }: DynamicControl): Validators {
    return (Object.keys(validators) as Array<keyof typeof validators>).map((validatorKey) => {
      const validatorValue = validators[validatorKey];

      if (validatorKey === 'required') return Validators.required;
      if (validatorKey === 'email') return Validators.email;
      if (validatorKey === 'minLength' && typeof validatorValue === 'number') {
        return Validators.minLength(validatorValue);
      }
      if (validatorKey === 'banWords' && Array.isArray(validatorValue)) {
        return banWords(validatorValue);
      }

      return Validators.nullValidator;
    });
  }

  protected onSubmit() {
    console.log('Submitted data: ', this.form.value);
    this.form.reset();
  }
}
