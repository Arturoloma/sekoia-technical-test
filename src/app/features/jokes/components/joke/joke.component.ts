import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BadgeComponent, CardComponent } from '@components';
import { Joke, JokeType } from '@models';

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
  public flags = computed<string[]>(() =>
    Object.entries(this.joke().flags)
      .filter(([, value]) => value)
      .map(([key]) => `${key.slice(0, 1).toLocaleUpperCase()}${key.slice(1)}`),
  );

  public readonly JokeType = JokeType;
}
