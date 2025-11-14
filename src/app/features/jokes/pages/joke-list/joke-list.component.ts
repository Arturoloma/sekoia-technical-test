import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { jokesStore } from '../../store/jokes.store';
import { JokeType } from '@models';
import { JokeComponent } from '../../components/joke/joke.component';
import { SearchInputDirective } from '@directives';
import { debounceTime } from 'rxjs';
import { SpinnerComponent } from '@components';

@Component({
  selector: 'sek-joke-list',
  templateUrl: './joke-list.component.html',
  styleUrls: ['./joke-list.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JokeComponent, ReactiveFormsModule, SearchInputDirective, SpinnerComponent],
})
export class JokeListComponent implements OnInit {
  public readonly store = inject(jokesStore);

  public readonly searchJokesForm = new FormGroup({
    search: new FormControl<string>(''),
  });

  public readonly JokeType = JokeType;

  private readonly _destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.searchJokesForm
      .get('search')
      ?.valueChanges.pipe(debounceTime(300), takeUntilDestroyed(this._destroyRef))
      .subscribe((searchValue) => {
        this.store.updateFilters({ contains: searchValue ?? undefined });
      });
  }
}
