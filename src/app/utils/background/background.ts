import {BackgroundCloud} from "./background-cloud";
import {BackgroundCrap} from "./background-crap";
import {IParam} from "../../models/utils.model";

export class Background {
    private readonly params: IParam;
    clouds: BackgroundCloud[] = [];
    craps: BackgroundCrap[] = [];
    constructor(params: IParam) {
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
        for (let i = 0; i < 50; ++i) {
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