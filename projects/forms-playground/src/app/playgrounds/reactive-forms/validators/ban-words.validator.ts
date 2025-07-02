import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function banWords(bannedWords: string[] = []): ValidatorFn {
  return (control: AbstractControl<string | null>): ValidationErrors | null => {
    const foundBannedWord = bannedWords.find((word) => word.toLocaleLowerCase() === control.value?.toLocaleLowerCase());

    return foundBannedWord ? { banWords: { bannedWord: foundBannedWord } } : null;
  };
}
