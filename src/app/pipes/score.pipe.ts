import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'score'
})
export class ScorePipe implements PipeTransform {
  transform(value: number): string {
    return Math.round(value)
        .toLocaleString(
            'en-US',
            { minimumIntegerDigits: 5, useGrouping: false }
        );
  }

}
