import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Directive({
  selector: '[appBanWords]',
  standalone: true,
  providers: [
    { provide: NG_VALIDATORS, useExisting: BanWordsDirective, multi: true },
  ],
})
export class BanWordsDirective implements Validator {
  @Input()
  set appBanWords(value: string | string[]) {
    this.bannedWords = Array.isArray(value) ? value : [value];
    this.onChange();
  }

  private bannedWords: string[] = [];
  private onChange: () => void = () => {};

  constructor() {}

  validate(control: AbstractControl<string>): ValidationErrors | null {
    const foundBannedWord = this.bannedWords.find(
      (word) => word.toLocaleLowerCase() === control.value?.toLocaleLowerCase()
    );

    return foundBannedWord
      ? { appBanWords: { bannedWord: foundBannedWord } }
      : null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onChange = fn;
  }
}
