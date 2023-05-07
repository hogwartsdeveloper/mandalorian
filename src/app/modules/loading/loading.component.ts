import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  standalone: true
})
export class LoadingComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('audio') audio: ElementRef<HTMLAudioElement>;

  count = 0;
  timeout: ReturnType<typeof setInterval>;
  ngOnInit() {
    this.timeout = setInterval(() => {
      this.count++;
      if (this.count === 100) {
        clearInterval(this.timeout);
      }
    }, 30)
  }

  ngAfterViewInit() {
    this.audio.nativeElement.play()
  }

  ngOnDestroy() {
    clearInterval(this.timeout);
  }
}
