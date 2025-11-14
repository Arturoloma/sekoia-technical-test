/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JokeListComponent } from './joke-list.component';
import { jokesStore } from '../../store/jokes.store';
import { provideMockJokesStore } from '../../store/jokes-store.mock';
import { provideZonelessChangeDetection } from '@angular/core';

describe('JokeListComponent', () => {
  let fixture: ComponentFixture<JokeListComponent>;
  let component: JokeListComponent;
  let store: ReturnType<typeof TestBed.inject<typeof jokesStore>>;
  let updateFiltersSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JokeListComponent],
      providers: [provideZonelessChangeDetection(), provideMockJokesStore()],
    }).compileComponents();

    jest.useFakeTimers();
    fixture = TestBed.createComponent(JokeListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(jokesStore) as any;
    updateFiltersSpy = jest.spyOn<any, any>(store, 'updateFilters');

    fixture.autoDetectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('should load', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateFilters with trimmed value after debounce', () => {
    setSearchValue(component, '  chuck  ');

    jest.advanceTimersByTime(300);

    expect(updateFiltersSpy).toHaveBeenCalledWith({
      contains: 'chuck',
    });
  });

  it('should call updateFilters with undefined when value is only whitespace', () => {
    setSearchValue(component, '   ');

    jest.advanceTimersByTime(300);

    expect(updateFiltersSpy).toHaveBeenCalledWith({
      contains: undefined,
    });
  });

  it('should not call updateFilters twice for the same value (distinctUntilChanged)', () => {
    setSearchValue(component, 'joke');
    jest.advanceTimersByTime(300);

    setSearchValue(component, 'joke');
    jest.advanceTimersByTime(300);

    expect(updateFiltersSpy).toHaveBeenCalledTimes(1);
  });

  it('should stop reacting to changes after destroy (takeUntilDestroyed)', () => {
    setSearchValue(component, 'first');
    jest.advanceTimersByTime(300);
    expect(updateFiltersSpy).toHaveBeenCalledTimes(1);

    fixture.destroy();

    setSearchValue(component, 'second');
    jest.advanceTimersByTime(300);

    expect(updateFiltersSpy).toHaveBeenCalledTimes(1);
  });
});

function setSearchValue(component: JokeListComponent, value: string | null): void {
  const control = component.searchJokesForm.get('search');
  control?.setValue(value);
}
