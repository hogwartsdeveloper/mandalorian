import {BackgroundCloud} from "./background-cloud";
import {BackgroundCrap} from "./background-crap";

export class Background {
    params;
    clouds: BackgroundCloud[] = [];
    craps: BackgroundCrap[] = [];
    constructor(params: any) {
        this.params = params;

        this.spawnClouds();
        this.spawnCrap();
    }

    spawnClouds() {
        for (let i = 0; i < 50; ++i) {
            const cloud = new BackgroundCloud(this.params);
            this.clouds.push(cloud);
        }
    }

    spawnCrap() {
        for (let i = 0; i < 60; ++i) {
            const crap = new BackgroundCrap(this.params);
            this.craps.push(crap);
        }
    }

    update(timeElapsed: number) {
        for (let cloud of this.clouds) {
            cloud.update(timeElapsed);
        }

        for (let crap of this.craps) {
            crap.update(timeElapsed);
        }
    }
}