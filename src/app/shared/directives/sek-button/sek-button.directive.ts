import { Directive, ElementRef, inject, OnInit, Renderer2 } from '@angular/core';
import { Tokens } from '@styles';

@Directive({
  selector: 'button[sekButton]',
  standalone: true,
})
export class SekButtonDirective implements OnInit {
  private readonly _elementRef = inject(ElementRef);
  private readonly _renderer = inject(Renderer2);

  public ngOnInit(): void {
    this._styleHostButton();
  }

  private _styleHostButton(): void {
    const host = this._elementRef.nativeElement;

    this._renderer.setStyle(host, 'border', `${Tokens.size1Px} solid ${Tokens.colorBorder}`);
    this._renderer.setStyle(host, 'border-radius', Tokens.borderRadiusM);
    this._renderer.setStyle(host, 'background-color', Tokens.colorBackgroundSecondary);
    this._renderer.setStyle(host, 'min-width', Tokens.size36Px);
    this._renderer.setStyle(host, 'height', Tokens.size36Px);
    this._renderer.setStyle(host, 'display', 'flex');
    this._renderer.setStyle(host, 'align-items', 'center');
    this._renderer.setStyle(host, 'justify-content', 'center');
    this._renderer.setStyle(host, 'cursor', 'pointer');
  }
}
