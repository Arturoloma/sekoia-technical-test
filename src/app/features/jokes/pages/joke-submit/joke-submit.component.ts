import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'skio-joke-submit',
  templateUrl: './joke-submit.component.html',
  styleUrls: ['./joke-submit.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JokeSubmitComponent {
  // Submit joke page
  // Requirements:
  // - Input field for joke
  // - Submit button
  // - Handle API submission
}
