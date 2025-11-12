import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'sek-jokes',
  templateUrl: './jokes.component.html',
  styleUrls: ['./jokes.component.scss'],
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JokesComponent {}
