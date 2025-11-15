import {
  ComponentRef,
  Directive,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';
import { Tokens } from '@styles';

@Directive({
  selector: 'input[type=search][sekInput], input[type=text][sekInput]',
  standalone: true,
})
export class SekInputDirective implements OnInit, OnDestroy {
  private readonly _elementRef = inject(ElementRef);
  private readonly _renderer = inject(Renderer2);
  private readonly _viewContainerRef = inject(ViewContainerRef);

  private readonly _inputType: 'text' | 'search' = this._elementRef.nativeElement.type;

  private _wrapper!: HTMLElement;
  private _searchIconRef!: ComponentRef<NgIconComponent>;

  public ngOnInit(): void {
    console.log('input type', this._inputType);
    this._wrapHostInput();
    this._styleHostInput();
    if (this._inputType === 'search') {
      this._createSearchIcon();
    }
  }

  public ngOnDestroy(): void {
    this._searchIconRef?.destroy();
  }

  private _createSearchIcon(): void {
    const iconContainer = this._renderer.createElement('span');

    this._renderer.setStyle(iconContainer, 'position', 'absolute');
    this._renderer.setStyle(iconContainer, 'left', Tokens.spacing12Px);
    this._renderer.setStyle(iconContainer, 'top', '50%');
    this._renderer.setStyle(iconContainer, 'transform', 'translateY(-50%)');
    this._renderer.setStyle(iconContainer, 'pointer-events', 'none');
    this._renderer.setStyle(iconContainer, 'display', 'flex');
    this._renderer.setStyle(iconContainer, 'align-items', 'center');

    this._renderer.appendChild(this._wrapper, iconContainer);

    this._searchIconRef = this._viewContainerRef.createComponent(NgIconComponent);
    this._searchIconRef.setInput('name', 'heroMagnifyingGlass');

    this._renderer.appendChild(iconContainer, this._searchIconRef.location.nativeElement);
  }

  private _styleHostInput(): void {
    const host = this._elementRef.nativeElement;
    this._renderer.setStyle(host, 'border', `${Tokens.size1Px} solid ${Tokens.colorBorder}`);
    this._renderer.setStyle(
      host,
      'padding-left',
      this._inputType === 'search' ? '38px' : Tokens.spacing12Px,
    );
    this._renderer.setStyle(host, 'padding-right', Tokens.spacing12Px);
    this._renderer.setStyle(host, 'border-radius', Tokens.borderRadiusM);
    this._renderer.setStyle(host, 'line-height', Tokens.lineHeightM);
    this._renderer.setStyle(host, 'min-height', Tokens.size36Px);
    this._renderer.setStyle(host, 'background-color', Tokens.colorBackgroundSecondary);
  }

  private _wrapHostInput(): void {
    const host = this._elementRef.nativeElement;
    this._wrapper = this._renderer.createElement('div');

    this._renderer.setStyle(this._wrapper, 'position', 'relative');

    const parentNode = this._renderer.parentNode(host);
    this._renderer.insertBefore(parentNode, this._wrapper, host);
    this._renderer.appendChild(this._wrapper, host);
  }
}
