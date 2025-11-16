import { DestroyRef, Directive, ElementRef, inject, input, OnInit, Renderer2 } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Tokens } from '@styles';

@Directive({
  selector: 'button[sekButton]',
  standalone: true,
})
export class SekButtonDirective implements OnInit {
  public active = input<boolean>(false);
  public disabled = input<boolean>(false);

  private readonly _destroyRef = inject(DestroyRef);
  private readonly _elementRef = inject(ElementRef);
  private readonly _renderer = inject(Renderer2);

  constructor() {
    toObservable(this.active)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((isActive: boolean) => {
        this._styleByActivity(isActive);
      });

    toObservable(this.disabled)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((isDisabled: boolean) => {
        this._styleByDisabled(isDisabled);
      });
  }

  public ngOnInit(): void {
    this._styleHostButton();
  }

  private _styleByActivity(isButtonActive: boolean): void {
    const host = this._elementRef.nativeElement;
    this._renderer.setStyle(
      host,
      'background-color',
      isButtonActive ? Tokens.colorBackgroundActive : Tokens.colorBackgroundSecondary,
    );
    this._renderer.setStyle(
      host,
      'color',
      isButtonActive ? Tokens.colorTextActive : Tokens.colorText,
    );
    this._renderer.setStyle(
      host,
      'border',
      `${Tokens.size1Px} solid ${isButtonActive ? Tokens.colorBorderActive : Tokens.colorBorder}`,
    );
  }

  private _styleByDisabled(isButtonDisabled: boolean): void {
    const host = this._elementRef.nativeElement;

    if (isButtonDisabled) {
      this._renderer.setStyle(host, 'opacity', '0.5');
      this._renderer.setStyle(host, 'cursor', 'not-allowed');
      this._renderer.setStyle(host, 'pointer-events', 'none');
    } else {
      this._renderer.removeStyle(host, 'opacity');
      this._renderer.setStyle(host, 'cursor', 'pointer');
      this._renderer.removeStyle(host, 'pointer-events');
    }
  }

  private _styleHostButton(): void {
    const host = this._elementRef.nativeElement;

    this._renderer.setStyle(host, 'border-radius', Tokens.borderRadiusM);
    this._renderer.setStyle(host, 'min-width', Tokens.size36Px);
    this._renderer.setStyle(host, 'height', Tokens.size36Px);
    this._renderer.setStyle(host, 'display', 'flex');
    this._renderer.setStyle(host, 'align-items', 'center');
    this._renderer.setStyle(host, 'justify-content', 'center');
  }
}
