import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SupportService {
  isLoadingEnd = new Subject<boolean>();
  constructor() { }
}
