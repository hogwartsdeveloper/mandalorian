import { Injectable } from '@angular/core';

@Injectable()
export class ScoreService {
  private score = 0;
  private maxScore = 0;

  constructor() {
    const maxValueFromStorage = localStorage.getItem('maxScore');
    if (maxValueFromStorage) {
      this.maxScore = +maxValueFromStorage;
    }
  }

  getMaxScore() {
    return this.maxScore;
  }

  updateScore(timeElapsed: number) {
    this.score += timeElapsed * 10;
    return this.score;
  }

  restart() {
    if (this.score > this.maxScore) {
      this.maxScore = this.score;
      localStorage.setItem('maxScore', this.maxScore.toString())
    }
    this.score = 0;

    return this.maxScore;
  }
}
