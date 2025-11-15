import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SpinnerComponent } from '@components';
import { SekButtonDirective, SekInputDirective } from '@directives';
import { JokeType } from '@models';
import { NgIcon } from '@ng-icons/core';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { JokeComponent } from '../../components/joke/joke.component';
import { jokesStore } from '../../store/jokes.store';

@Component({
  selector: 'sek-joke-list',
  templateUrl: './joke-list.component.html',
  styleUrls: ['./joke-list.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIcon,
    JokeComponent,
    ReactiveFormsModule,
    RouterLink,
    SekButtonDirective,
    SekInputDirective,
    SpinnerComponent,
  ],
})
export class JokeListComponent implements OnInit {
  public readonly store = inject(jokesStore);

  public readonly searchJokesForm = new FormGroup({
    search: new FormControl<string>(''),
  });

  public readonly JokeType = JokeType;

  private readonly _destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this._updateFiltersOnSearch();
  }

  private _updateFiltersOnSearch(): void {
    this.searchJokesForm
      .get('search')
      ?.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((searchValue: string | null) => {
        const trimmedValue = searchValue?.trim();
        this.store.updateFilters({ contains: trimmedValue || undefined });
      });
  }
}
