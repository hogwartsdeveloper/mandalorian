import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  public state: AudioState;
  constructor() {
    let storage: string | AudioState | null = localStorage.getItem('audio');
    if (storage) {
      this.state = +storage;
      return;
    }
    this.state = AudioState.On;
  }

  setState(state: AudioState, audio: HTMLAudioElement) {
    localStorage.setItem('audio', String(state));
    this.state = state;

    switch (this.state) {
      case AudioState.On:
        audio.muted = false;
        break;
      case AudioState.Off:
        audio.muted = true;
        break;
    }
  }

  start(audio: HTMLAudioElement) {
    if (this.state === AudioState.On) {
      audio.volume = 0.19;
      audio?.play();
    }
  }

  restart(audio: HTMLAudioElement) {
    audio.currentTime = 0;
  }
}

export enum AudioState {
  On = 1,
  Off
}
