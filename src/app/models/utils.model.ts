import { Scene } from 'three';
import {WorldManager} from "../utils/world-manager";

export interface IParam {
    scene: Scene;
    world?: WorldManager;
}