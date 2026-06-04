import { Component, EventEmitter, HostBinding, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'cfc-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss'],
})
export class OptionComponent implements OnInit {
  @Input()
  value: string | null = null;

  @Input()
  disabledReason = '';

  @Input()
  @HostBinding('class.disabled')
  disabled = false;

  @Output()
  selected = new EventEmitter<OptionComponent>();

  @HostListener('click')
  protected select() {
    if (this.disabled) return;

    this.highlightAsSelected();
    this.selected.emit(this);
  }

  @HostBinding('class.selected')
  protected isSelected = false;

  constructor() {}

  ngOnInit(): void {}

  highlightAsSelected() {
    this.isSelected = true;
  }

  deselect() {
    this.isSelected = false;
  }
}
