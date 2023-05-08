import {Directive, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {LevelService} from "../services/level.service";
import {animate, AnimationBuilder, AnimationFactory, AnimationPlayer, style} from "@angular/animations";

@Directive({
  selector: '[appScore]'
})
export class ScoreDirective implements OnInit, OnDestroy {
  destroy$ = new Subject();
  animation: AnimationFactory;
  animationPlayer: AnimationPlayer;

  constructor(
      private el: ElementRef<HTMLDivElement>,
      private animationBuilder: AnimationBuilder,
      private levelService: LevelService
  ) {
    this.animation = this.animationBuilder.build([
        style({ opacity: 0 }),
        animate(250, style({ opacity: 1 })),
        animate(250, style({ opacity: 0 })),
        animate(250, style({ opacity: 1 })),
        animate(250, style({ opacity: 0 })),
        animate(250, style({ opacity: 1 })),
    ]);

    this.animationPlayer = this.animation.create(this.el.nativeElement);
  }

  ngOnInit() {
    this.levelService.level$
        .pipe(takeUntil(this.destroy$))
        .subscribe(level => {
          if (level > 0) {
            this.animationPlayer.play();
          }
        })
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

}
