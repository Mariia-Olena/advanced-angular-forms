import {
  AfterContentInit,
  Attribute,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { animate, state, style, transition, trigger, AnimationEvent } from '@angular/animations';
import { merge, startWith, Subject, switchMap, takeUntil, tap } from 'rxjs';

import { OptionComponent } from './option/option.component';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

export type SelectValue<T> = T | T[] | null;

@Component({
  selector: 'cfc-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  animations: [
    trigger('dropDown', [
      state('*', style({ transform: 'scaleY(1)', opacity: 1 })),
      state('void', style({ transform: 'scaleY(0)', opacity: 0 })),
      transition(':enter', [animate('320ms cubic-bezier(0, 1, 0.45, 1.34)')]),
      transition(':leave', [animate('420ms cubic-bezier(0.88,-0.7, 0.86, 0.85)')]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent<T> implements OnChanges, AfterContentInit, OnDestroy {
  @Input()
  label = '';

  @Input()
  searchable = false;

  @Input()
  displayWith: ((value: T) => string | number) | null = null;

  @Input()
  compareWith: (v1: T | null, v2: T | null) => boolean = (v1, v2) => v1 === v2;

  @Input()
  set value(value: SelectValue<T>) {
    this.selectionModel.clear();
    if (value) {
      Array.isArray(value) ? this.selectionModel.select(...value) : this.selectionModel.select(value);
    }
  }
  get value() {
    if (this.selectionModel.isEmpty()) {
      return null;
    }
    if (this.selectionModel.isMultipleSelection()) {
      return this.selectionModel.selected;
    }
    return this.selectionModel.selected[0];
  }
  private selectionModel = new SelectionModel<T>(coerceBooleanProperty(this.multiple));

  @Output() readonly opened = new EventEmitter<void>();
  @Output() readonly closed = new EventEmitter<void>();
  @Output() readonly selectedChanged = new EventEmitter<SelectValue<T>>();
  @Output() readonly searchChanged = new EventEmitter<string>();

  @HostListener('click')
  open() {
    this.isOpen = true;
    if (this.searchable) {
      requestAnimationFrame(() => this.searchInputEl.nativeElement.focus());
    }
  }
  close() {
    this.isOpen = false;
  }

  @ViewChild('input')
  searchInputEl!: ElementRef<HTMLInputElement>;

  @HostBinding('class.select-panel-open')
  @ContentChildren(OptionComponent, { descendants: true })
  options!: QueryList<OptionComponent<T>>;

  isOpen = false;

  protected get displayValue() {
    if (this.displayWith && this.value) {
      if (Array.isArray(this.value)) {
        return this.value.map(this.displayWith).join(', ');
      }
      return this.displayWith(this.value);
    }
    return this.value;
  }

  private optionMap = new Map<SelectValue<T>, OptionComponent<T>>();
  private unsubscribe$ = new Subject<void>();

  constructor(@Attribute('multiple') private multiple: string) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['compareWith']) {
      this.selectionModel.compareWith = changes['compareWith'].currentValue;
      this.highlightSelectedOption();
    }
  }

  ngAfterContentInit(): void {
    this.selectionModel.changed.pipe(takeUntil(this.unsubscribe$)).subscribe((values) => {
      values.removed.forEach((rv) => this.optionMap.get(rv)?.deselect());
      values.added.forEach((av) => this.optionMap.get(av)?.highlightAsSelected());
    });
    this.options.changes
      .pipe(
        startWith<QueryList<OptionComponent<T>>>(this.options),
        tap(() => this.refreshOption()),
        tap(() => this.highlightSelectedOption()),
        switchMap((options) => merge(...options.map((o) => o.selected))),
        takeUntil(this.unsubscribe$),
      )
      .subscribe((selectedOption) => this.handleSelection(selectedOption));
  }

  protected onPanelAnimationDone({ fromState, toState }: AnimationEvent): void {
    if (fromState === 'void' && toState === null && this.isOpen) this.opened.emit();
    if (fromState === null && toState === 'void' && !this.isOpen) this.closed.emit();
  }

  protected onHandleInput(event: Event) {
    this.searchChanged.emit((event.target as HTMLInputElement).value);
  }

  clearSelection(event: Event) {
    event.stopPropagation();
    this.selectionModel.clear();
    this.selectedChanged.emit(this.value);
  }

  private handleSelection(option: OptionComponent<T>) {
    if (option.value && !Array.isArray(option.value)) {
      this.selectionModel.toggle(option.value);
      this.selectedChanged.emit(this.value);
    }

    if (!this.selectionModel.isMultipleSelection()) {
      this.close();
    }
  }

  private refreshOption() {
    this.optionMap.clear();
    this.options.forEach((o) => this.optionMap.set(o.value, o));
  }

  private highlightSelectedOption() {
    const valuesWithUpdatedReferences = this.selectionModel.selected.map((value) => {
      const correspondingOption = this.findOptionByValue(value)?.value;
      return correspondingOption != null && !Array.isArray(correspondingOption) ? correspondingOption : value;
    });
    this.selectionModel.clear();
    this.selectionModel.select(...valuesWithUpdatedReferences);
  }

  private findOptionByValue(value: T | null) {
    if (this.optionMap.has(value)) {
      return this.optionMap.get(value);
    }

    return this.options && this.options.find((o) => !Array.isArray(o.value) && this.compareWith(o.value, value));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
