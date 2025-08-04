import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type RatingOptions = 'great' | 'good' | 'neutral' | 'bad' | null;

@Component({
  selector: 'cfc-rating-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating-picker.component.html',
  styleUrls: ['./rating-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: RatingPickerComponent,
      multi: true,
    },
  ],
})
export class RatingPickerComponent implements ControlValueAccessor, OnChanges {
  @Input() value: RatingOptions = null;
  @Input() disabled = false;
  @Output() changed = new EventEmitter<RatingOptions>();
  @HostBinding('attr.tabIndex') tabIndex = 0;
  @HostListener('blur')
  onBlur() {
    this.onTouch();
  }

  onChange: (newValue: RatingOptions) => void = () => {};
  onTouch: () => void = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) this.onChange(changes['value'].currentValue);
  }

  writeValue(obj: RatingOptions): void {
    this.value = obj;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  setValue(value: RatingOptions) {
    if (this.disabled) return;
    this.value = value;
    this.onChange(this.value);
    this.onTouch();
    this.changed.emit(this.value);
  }
}
