import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SekButtonDirective } from '@directives';
import { JokeCategory, JokeFlags, JokeLanguage, JokeType } from '@models';

@Component({
  selector: 'sek-joke-submit',
  templateUrl: './joke-submit.component.html',
  styleUrls: ['./joke-submit.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SekButtonDirective],
})
export class JokeSubmitComponent {
  public readonly jokeForm = new FormGroup({
    category: new FormControl<JokeCategory>(JokeCategory.ANY, { nonNullable: true }),
    delivery: new FormControl<string | undefined>(undefined, { nonNullable: true }),
    flags: new FormControl<JokeFlags>(
      {
        explicit: false,
        nsfw: false,
        political: false,
        racist: false,
        religious: false,
        sexist: false,
      },
      { nonNullable: true },
    ),
    joke: new FormControl<string | undefined>(undefined, { nonNullable: true }),
    lang: new FormControl<JokeLanguage>(JokeLanguage.ENGLISH, { nonNullable: true }),
    safe: new FormControl<boolean>(false, { nonNullable: true }),
    setup: new FormControl<string | undefined>(undefined, { nonNullable: true }),
    type: new FormControl<JokeType>(JokeType.SINGLE, { nonNullable: true }),
  });

  public readonly JokeType = JokeType;

  public selectJokeType(type: JokeType): void {
    this.jokeForm.patchValue({
      type,
    });
  }
}
