import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-dynamic-forms-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dynamic-forms-page.component.html',
  styleUrls: ['../../common-page.scss', './dynamic-forms-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormsPageComponent implements OnInit {
  protected formLoadingTrigger = new Subject<'user' | 'company'>();
  protected formConfig$!: Observable<object>;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.formConfig$ = this.formLoadingTrigger.pipe(switchMap((config) => this.http.get(`assets/${config}.form.json`)));
  }
}
