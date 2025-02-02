import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating-picker-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating-picker-page.component.html',
  styleUrls: [
    '../../common-page.scss',
    './rating-picker-page.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RatingPickerPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
