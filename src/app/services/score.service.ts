import {Injectable} from '@angular/core';
import {LevelService} from "./level.service";

@Injectable()
export class ScoreService {
  private score = 0;
  private maxScore = 0;

  constructor(private levelService: LevelService) {
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
    this.checkScore(this.score);
    return this.score;
  }

  checkScore(score: number) {
    score = Math.round(score);
    if (score % 100 === 0 && score > 0) {
      this.levelService.updateLevel(score);
    }
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
