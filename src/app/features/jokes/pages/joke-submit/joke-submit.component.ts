import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonsOptionListComponent, SpinnerComponent } from '@components';
import { SekButtonDirective, SekInputDirective } from '@directives';
import {
  ButtonOption,
  JokeCategory,
  JokeFlag,
  JokeLanguage,
  JokeType,
  SubmitJokeParameters,
} from '@models';
import { NgIcon } from '@ng-icons/core';
import { firstCharToLocaleUpperCase } from '@utils';
import { jokesStore } from '../../store/jokes.store';

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
    SpinnerComponent,
  ],
})
export class JokeSubmitComponent {
  // TODO: Validation
  public readonly jokeForm = new FormGroup({
    category: new FormControl<JokeCategory>(JokeCategory.ANY, { nonNullable: true }),
    delivery: new FormControl<string | undefined>(undefined, { nonNullable: true }),
    flags: new FormControl<JokeFlag[]>([], { nonNullable: true }),
    joke: new FormControl<string | undefined>(undefined, { nonNullable: true }),
    lang: new FormControl<JokeLanguage>(JokeLanguage.ENGLISH, { nonNullable: true }),
    safe: new FormControl<boolean>(false, { nonNullable: true }),
    setup: new FormControl<string | undefined>(undefined, { nonNullable: true }),
    type: new FormControl<JokeType[]>([JokeType.SINGLE], { nonNullable: true }),
  });
  public readonly jokeTypeOptions: ButtonOption[] = [
    {
      label: 'Single',
      value: JokeType.SINGLE,
    },
    {
      label: 'Two-part',
      value: JokeType.TWO_PART,
    },
  ];
  public readonly flagOptions: ButtonOption[] = Object.values(JokeFlag).map((flag: string) => ({
    label: firstCharToLocaleUpperCase(flag),
    value: flag,
  }));
  public readonly store = inject(jokesStore);

  public readonly JokeType = JokeType;

  public onSubmit(): void {
    const selectedFlags: JokeFlag[] = this.jokeForm.get('flags')!.value;
    const params: SubmitJokeParameters = {
      formatVersion: 3,
      category: this.jokeForm.get('category')!.value,
      delivery: this.jokeForm.get('delivery')?.value,
      flags: {
        explicit: !!selectedFlags?.some((flag: string) => flag === JokeFlag.EXPLICIT),
        nsfw: !!selectedFlags?.some((flag: string) => flag === JokeFlag.NSFW),
        political: !!selectedFlags?.some((flag: string) => flag === JokeFlag.POLITICAL),
        racist: !!selectedFlags?.some((flag: string) => flag === JokeFlag.RACIST),
        religious: !!selectedFlags?.some((flag: string) => flag === JokeFlag.RELIGIOUS),
        sexist: !!selectedFlags?.some((flag: string) => flag === JokeFlag.SEXIST),
      },
      joke: this.jokeForm.get('joke')?.value,
      lang: JokeLanguage.ENGLISH,
      safe: false,
      setup: this.jokeForm.get('setup')?.value,
      type: this.jokeForm.get('type')!.value[0],
    };

    this.store.submitJoke(params);
  }
}
