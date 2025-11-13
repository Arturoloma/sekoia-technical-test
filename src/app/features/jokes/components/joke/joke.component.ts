import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BadgeComponent, CardComponent } from '@components';
import { Joke, JokeType } from '@models';
import { firstCharToLocaleUpperCase } from '@utils';

@Component({
  selector: 'sek-joke',
  templateUrl: './joke.component.html',
  styleUrls: ['./joke.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardComponent, BadgeComponent],
})
export class JokeComponent {
  public joke = input.required<Joke>();
  public badges = computed<string[]>(() => {
    const joke = this.joke();

    return [
      joke.type === JokeType.SINGLE ? 'Single' : 'Two-part',
      ...Object.entries(joke.flags)
        .filter(([, value]) => value)
        .map(([key]) => firstCharToLocaleUpperCase(key)),

      firstCharToLocaleUpperCase(joke.category),
    ];
  });

  public readonly JokeType = JokeType;
}
