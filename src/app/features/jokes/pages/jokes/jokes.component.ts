import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'sek-jokes',
  templateUrl: './jokes.component.html',
  styleUrls: ['./jokes.component.scss'],
  imports: [RouterOutlet],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JokesComponent {}
