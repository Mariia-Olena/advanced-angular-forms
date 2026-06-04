import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  QueryList,
} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { animate, state, style, transition, trigger, AnimationEvent } from '@angular/animations';
import { OptionComponent } from './option/option.component';
import { merge, startWith, Subject, switchMap, takeUntil } from 'rxjs';

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
})
export class SelectComponent implements AfterContentInit, OnDestroy {
  @Input()
  label = '';

  @Input()
  set value(value: string | null) {
    this.selectionModel.clear();
    if (value) this.selectionModel.select(value);
  }
  get value() {
    return this.selectionModel.selected[0] || null;
  }
  private selectionModel = new SelectionModel<string>();

  @Output() readonly opened = new EventEmitter<void>();
  @Output() readonly closed = new EventEmitter<void>();
  @Output() readonly selectedChanged = new EventEmitter<string | null>();

  @HostListener('click')
  open() {
    this.isOpen = true;
  }
  close() {
    this.isOpen = false;
  }

  @ContentChildren(OptionComponent, { descendants: true })
  options!: QueryList<OptionComponent>;

  isOpen = false;

  private unsubscribe$ = new Subject<void>();

  constructor() {}

  ngAfterContentInit(): void {
    this.highlightSelectedOption(this.value);
    this.selectionModel.changed
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((values) => values.removed.forEach((rv) => this.findOptionByValue(rv)?.deselect()));
    this.options.changes
      .pipe(
        startWith<QueryList<OptionComponent>>(this.options),
        switchMap((options) => merge(...options.map((o) => o.selected))),
        takeUntil(this.unsubscribe$),
      )
      .subscribe((selectedOption) => this.handleSelection(selectedOption));
  }

  onPanelAnimationDone({ fromState, toState }: AnimationEvent): void {
    if (fromState === 'void' && toState === null && this.isOpen) this.opened.emit();
    if (fromState === null && toState === 'void' && !this.isOpen) this.closed.emit();
  }

  private handleSelection(option: OptionComponent) {
    if (option.value) {
      this.selectionModel.toggle(option.value);
      this.selectedChanged.emit(this.value);
    }
    this.close();
  }

  private highlightSelectedOption(value: string | null) {
    this.findOptionByValue(value)?.highlightAsSelected();
  }

  private findOptionByValue(value: string | null) {
    return this.options && this.options.find((o) => o.value === value);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
