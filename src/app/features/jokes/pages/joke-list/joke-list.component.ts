import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { jokesStore } from '../../store/jokes.store';
import { JokeType } from '@models';
import { JokeComponent } from '../../components/joke/joke.component';

@Component({
  selector: 'sek-joke-list',
  templateUrl: './joke-list.component.html',
  styleUrls: ['./joke-list.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JokeComponent],
})
export class JokeListComponent {
  public readonly store = inject(jokesStore);

  public readonly JokeType = JokeType;
}
