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
  public label = input.required<string>();
  public options = input.required<[ButtonOption, ...ButtonOption[]]>();

  private _selectedOption?: string;
  public get selectedOption(): string | undefined {
    return this._selectedOption;
  }
  public set selectedOption(option: string) {
    this._selectedOption = option;
    this._onChange(option);
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

  public writeValue(value: string): void {
    this._selectedOption = value;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public registerOnChange(fn: (_: any) => void): void {
    this._onChange = fn;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  public selectOption(optionValue: string): void {
    this.selectedOption = optionValue;
  }
}
