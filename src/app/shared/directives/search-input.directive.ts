import {
  Directive,
  ElementRef,
  Renderer2,
  OnInit,
  OnDestroy,
  inject,
  ViewContainerRef,
  ComponentRef,
} from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';
import { Tokens } from '@styles';

@Directive({
  selector: 'input[type=search][sekSearchInput]',
  standalone: true,
})
export class SearchInputDirective implements OnInit, OnDestroy {
  private readonly _elementRef = inject(ElementRef);
  private readonly _renderer = inject(Renderer2);
  private readonly _viewContainerRef = inject(ViewContainerRef);

  private _wrapper!: HTMLElement;
  private _searchIconRef!: ComponentRef<NgIconComponent>;

  public ngOnInit(): void {
    this._wrapHostInput();
    this._styleHostInput();
    this._createSearchIcon();
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
    this._searchIconRef.setInput('size', '18');
    this._searchIconRef.setInput('color', Tokens.colorIconSubtle);

    this._renderer.appendChild(iconContainer, this._searchIconRef.location.nativeElement);
  }

  private _styleHostInput(): void {
    const input = this._elementRef.nativeElement;
    this._renderer.setStyle(input, 'border', `${Tokens.size1Px} solid ${Tokens.colorBorder}`);
    this._renderer.setStyle(input, 'padding-left', '38px');
    this._renderer.setStyle(input, 'padding-right', Tokens.spacing12Px);
    this._renderer.setStyle(input, 'border-radius', Tokens.borderRadiusM);
    this._renderer.setStyle(input, 'line-height', Tokens.lineHeightM);
    this._renderer.setStyle(input, 'min-height', Tokens.size36Px);
    this._renderer.setStyle(input, 'background-color', Tokens.colorBackgroundSecondary);
  }

  private _wrapHostInput(): void {
    const input = this._elementRef.nativeElement;
    this._wrapper = this._renderer.createElement('div');

    this._renderer.setStyle(this._wrapper, 'position', 'relative');

    const hostInput = this._renderer.parentNode(input);
    this._renderer.insertBefore(hostInput, this._wrapper, input);
    this._renderer.appendChild(this._wrapper, input);
  }
}
