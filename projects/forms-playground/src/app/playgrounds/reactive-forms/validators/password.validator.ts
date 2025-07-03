import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function password(control: AbstractControl<string | null>): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  const errors = { passwordShouldMatch: { mismatch: true } };

  if (password?.value === confirmPassword?.value) {
    return null;
  }
  confirmPassword?.setErrors(errors);
  
  return errors;
}
