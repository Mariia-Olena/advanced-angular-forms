import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserSkillsService {
  constructor() {}

  getSkills(): Observable<string[]> {
    return of(['angular', 'typescript', 'git', 'docker']).pipe(delay(1000));
  }
}
