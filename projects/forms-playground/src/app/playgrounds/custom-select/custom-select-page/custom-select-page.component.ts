import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-select-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-select-page.component.html',
  styleUrls: [
    '../../common-page.scss',
    './custom-select-page.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomSelectPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
