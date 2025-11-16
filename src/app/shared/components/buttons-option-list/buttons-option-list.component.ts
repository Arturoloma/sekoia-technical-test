import { ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SekButtonDirective } from '@directives';
import { ButtonOption } from '@models';

@Component({
  selector: 'sek-buttons-option-list',
  templateUrl: './buttons-option-list.component.html',
  styleUrls: ['./buttons-option-list.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, SekButtonDirective],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ButtonsOptionListComponent),
      multi: true,
    },
  ],
})
export class ButtonsOptionListComponent implements ControlValueAccessor {
  public allowVoidSelection = input<boolean>(true);
  public label = input.required<string>();
  public multiSelectable = input<boolean>(false);
  public options = input.required<ButtonOption[], ButtonOption[]>({
    transform: (value: ButtonOption[]) => {
      if (value.length < 1) {
        throw new Error('ButtonsOptionListComponent requires at least 1 option in options array');
      }
      return value;
    },
  });

  public activeDescendant?: string;

  private _selectedOptions?: string[];
  public get selectedOptions(): string[] | undefined {
    return this._selectedOptions;
  }
  public set selectedOptions(options: string[]) {
    this._selectedOptions = options;
    this._onChange(options);
    this._onTouched();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _onChange: (_: any) => void = () => {
    /* empty */
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _onTouched: any = () => {
    /* empty */
  };

  public isOptionSelected(optionValue: string): boolean {
    if (!this.selectedOptions) {
      return false;
    }

    return this.selectedOptions.some((option: string) => optionValue === option);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public registerOnChange(fn: (_: any) => void): void {
    this._onChange = fn;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  public toggleOption(optionValue: string): void {
    let selectedOptionsArr: string[] = [...(this.selectedOptions ?? [])];

    this.activeDescendant = optionValue;

    if (this.isOptionSelected(optionValue)) {
      if (selectedOptionsArr.length > 1 || this.allowVoidSelection()) {
        selectedOptionsArr = selectedOptionsArr.filter(
          (selectedOptionValue: string) => selectedOptionValue !== optionValue,
        );
      }
    } else {
      if (!this.multiSelectable()) {
        selectedOptionsArr = [optionValue];
      } else {
        selectedOptionsArr.push(optionValue);
      }
    }

    this.selectedOptions = [...new Set(selectedOptionsArr)];
  }

  public writeValue(value: string[]): void {
    this._selectedOptions = value;
  }
}
