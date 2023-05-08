import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable()
export class LevelService {
  level$ = new BehaviorSubject<number>(0);
  constructor() { }

  updateLevel(score: number) {
    const level = score / 100;
    if (this.level$.value !== level) {
      this.level$.next(level)
    }
  }
}
