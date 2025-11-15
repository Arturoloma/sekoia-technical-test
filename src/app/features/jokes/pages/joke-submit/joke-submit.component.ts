import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonsOptionListComponent } from '@components';
import { SekButtonDirective, SekInputDirective } from '@directives';
import { ButtonOption, JokeCategory, JokeFlags, JokeLanguage, JokeType } from '@models';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'sek-joke-submit',
  templateUrl: './joke-submit.component.html',
  styleUrls: ['./joke-submit.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonsOptionListComponent,
    NgIcon,
    ReactiveFormsModule,
    RouterLink,
    SekButtonDirective,
    SekInputDirective,
  ],
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

  public readonly jokeTypeOptions: [ButtonOption, ...ButtonOption[]] = [
    {
      label: 'Single',
      value: JokeType.SINGLE,
    },
    {
      label: 'Two-part',
      value: JokeType.TWO_PART,
    },
  ];

  public readonly JokeType = JokeType;

  public selectJokeType(type: JokeType): void {
    this.jokeForm.patchValue({
      type,
    });
  }
}
