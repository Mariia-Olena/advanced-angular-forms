import { Directive, ElementRef, HostListener, Renderer2, SecurityContext } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

const DEFAULT_REVIEW_TEMPLATE = `
  <h4 data-placeholder="Title..."></h4>
  <p data-placeholder="Describe Your Experience..."></p>
`;

@Directive({
  selector: '[formControlName][contenteditable],[formControl][contenteditable],[ngModel][contenteditable]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: EditableContentDirective,
      multi: true,
    },
  ],
})
export class EditableContentDirective implements ControlValueAccessor {
  @HostListener('input', ['$event'])
  onInput(event: Event) {
    this.onChange((event.target as HTMLElement).innerHTML);
  }
  @HostListener('blur')
  OnBlur(event: Event) {
    this.OnTouched();
  }

  onChange!: (newValue: string) => void;
  OnTouched!: () => void;

  constructor(private renderer: Renderer2, private elementRef: ElementRef, private sanitizer: DomSanitizer) {}

  writeValue(obj: any): void {
    this.renderer.setProperty(
      this.elementRef.nativeElement,
      'innerHTML',
      this.sanitizer.sanitize(SecurityContext.HTML, obj) || DEFAULT_REVIEW_TEMPLATE
    );
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.OnTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'contentEditable', !isDisabled);
  }
}
