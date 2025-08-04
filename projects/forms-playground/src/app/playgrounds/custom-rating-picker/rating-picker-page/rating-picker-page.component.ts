import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EditableContentDirective } from '../value-accessor/editable-content.directive';
import { RatingPickerComponent } from 'custom-form-controls';
import { RatingOptions } from 'projects/custom-form-controls/src/lib/rating-picker/rating-picker.component';

@Component({
  selector: 'app-rating-picker-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EditableContentDirective, RatingPickerComponent],
  templateUrl: './rating-picker-page.component.html',
  styleUrls: ['../../common-page.scss', './rating-picker-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingPickerPageComponent implements OnInit {
  form = new FormGroup({
    reviewText: new FormControl(''),
    reviewRating: new FormControl<RatingOptions>(null),
  });

  constructor() {}

  ngOnInit(): void {}

  onSubmit(): void {
    console.log(this.form.value);
  }
}
