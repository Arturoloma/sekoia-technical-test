import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
export class JokeSubmitComponent implements OnInit {
  public readonly jokeForm = new FormGroup({
    category: new FormControl<JokeCategory>(JokeCategory.ANY, { nonNullable: true }),
    delivery: new FormControl<string | undefined>(undefined, { nonNullable: true }),
    flags: new FormControl<JokeFlag[]>([], { nonNullable: true }),
    joke: new FormControl<string | undefined>(undefined, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    lang: new FormControl<JokeLanguage[]>([JokeLanguage.ENGLISH], { nonNullable: true }),
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
  public readonly langOptions: ButtonOption[] = Object.entries(JokeLanguage).map(
    ([key, value]) => ({
      label: firstCharToLocaleUpperCase(key.toLocaleLowerCase()),
      value: value,
    }),
  );
  public readonly store = inject(jokesStore);

  public readonly JokeType = JokeType;

  private readonly _destroyRef = inject(DestroyRef);

  constructor() {
    this._resetFormOnSuccess();
  }

  public ngOnInit(): void {
    this._setDynamicValidation();
  }

  public onSubmit(): void {
    const selectedFlags: JokeFlag[] = this.jokeForm.get('flags')!.value;
    const jokeType = this.jokeForm.get('type')!.value[0];
    const params: SubmitJokeParameters = {
      formatVersion: 3,
      category: this.jokeForm.get('category')!.value,
      delivery: jokeType === JokeType.TWO_PART ? this.jokeForm.get('delivery')?.value : undefined,
      flags: {
        explicit: !!selectedFlags?.some((flag: string) => flag === JokeFlag.EXPLICIT),
        nsfw: !!selectedFlags?.some((flag: string) => flag === JokeFlag.NSFW),
        political: !!selectedFlags?.some((flag: string) => flag === JokeFlag.POLITICAL),
        racist: !!selectedFlags?.some((flag: string) => flag === JokeFlag.RACIST),
        religious: !!selectedFlags?.some((flag: string) => flag === JokeFlag.RELIGIOUS),
        sexist: !!selectedFlags?.some((flag: string) => flag === JokeFlag.SEXIST),
      },
      joke: jokeType === JokeType.SINGLE ? this.jokeForm.get('joke')?.value : undefined,
      lang: this.jokeForm.get('lang')!.value[0],
      safe: false,
      setup: jokeType === JokeType.TWO_PART ? this.jokeForm.get('setup')?.value : undefined,
      type: jokeType,
    };

    this.store.submitJoke(params);
  }

  private _resetFormOnSuccess(): void {
    toObservable(this.store.submitJokeSuccess)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((success: boolean | null) => {
        if (success) {
          this.jokeForm.reset();
        }
      });
  }

  private _setDynamicValidation(): void {
    this.jokeForm
      .get('type')
      ?.valueChanges.pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((jokeType: JokeType[]) => {
        const deliveryControl = this.jokeForm.get('delivery');
        const jokeControl = this.jokeForm.get('joke');
        const setupControl = this.jokeForm.get('setup');

        if (jokeType[0] === JokeType.SINGLE) {
          jokeControl?.setValidators(Validators.required);
          setupControl?.removeValidators(Validators.required);
          deliveryControl?.removeValidators(Validators.required);
        } else {
          setupControl?.setValidators(Validators.required);
          deliveryControl?.setValidators(Validators.required);
          jokeControl?.removeValidators(Validators.required);
        }

        deliveryControl?.updateValueAndValidity();
        jokeControl?.updateValueAndValidity();
        setupControl?.updateValueAndValidity();
      });
  }
}
