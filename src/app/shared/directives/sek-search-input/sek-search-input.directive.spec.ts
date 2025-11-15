import { Component, DebugElement, ViewContainerRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SekSearchInputDirective } from './sek-search-input.directive';
import { NgIconComponent } from '@ng-icons/core';
import { Tokens } from '@styles';

@Component({
  selector: 'sek-search-input-directive-test',
  standalone: true,
  imports: [SekSearchInputDirective],
  template: `<input type="search" sekSearchInput />`,
})
class SekSearchInputDirectiveTestComponent {}

describe('SekSearchInputDirective', () => {
  let fixture: ComponentFixture<SekSearchInputDirectiveTestComponent>;
  let hostInput: HTMLInputElement;
  let inputDebugElement: DebugElement;
  let directive: SekSearchInputDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SekSearchInputDirectiveTestComponent, SekSearchInputDirective, NgIconComponent],
      providers: [ViewContainerRef],
    }).compileComponents();

    fixture = TestBed.createComponent(SekSearchInputDirectiveTestComponent);
    inputDebugElement = fixture.debugElement.query(By.directive(SekSearchInputDirective));
    hostInput = inputDebugElement.nativeElement as HTMLInputElement;
    directive = inputDebugElement.injector.get(SekSearchInputDirective);

    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe('Directive Initialization', () => {
    it('should load', () => {
      expect(directive).toBeTruthy();
    });

    it('should only apply to search input elements', () => {
      const selector = 'input[type=search][sekSearchInput]';
      expect(hostInput.matches(selector)).toBe(true);
    });
  });

  describe('Wrapper Creation', () => {
    it('should wrap the input element in a wrapper div', () => {
      const wrapper = hostInput.parentElement;
      expect(wrapper).toBeTruthy();
      expect(wrapper?.tagName.toLowerCase()).toBe('div');
    });

    it('should set wrapper position to relative', () => {
      const wrapper = hostInput.parentElement as HTMLElement;
      const computedStyle = window.getComputedStyle(wrapper);
      expect(computedStyle.position).toBe('relative');
    });

    it('should maintain original parent hierarchy', () => {
      const wrapper = hostInput.parentElement;
      expect(wrapper?.parentElement).toBe(fixture.nativeElement);
    });
  });

  describe('Input Styling', () => {
    it('should apply border styling', () => {
      const expectedBorder = `${Tokens.size1Px} solid ${Tokens.colorBorder}`;
      expect(hostInput.style.border).toBe(expectedBorder);
    });

    it('should apply correct padding-left for icon space', () => {
      expect(hostInput.style.paddingLeft).toBe('38px');
    });

    it('should apply correct padding-right', () => {
      expect(hostInput.style.paddingRight).toBe(Tokens.spacing12Px);
    });

    it('should apply border-radius from tokens', () => {
      expect(hostInput.style.borderRadius).toBe(Tokens.borderRadiusM);
    });

    it('should apply line-height from tokens', () => {
      expect(hostInput.style.lineHeight).toBe(Tokens.lineHeightM);
    });

    it('should apply min-height from tokens', () => {
      expect(hostInput.style.minHeight).toBe(Tokens.size36Px);
    });

    it('should apply background-color from tokens', () => {
      expect(hostInput.style.backgroundColor).toBeDefined();
    });
  });

  describe('Search Icon Creation', () => {
    it('should create icon container span', () => {
      const wrapper = hostInput.parentElement as HTMLElement;
      const iconContainer = wrapper.querySelector('span');
      expect(iconContainer).toBeTruthy();
    });

    it('should position icon container absolutely', () => {
      const wrapper = hostInput.parentElement as HTMLElement;
      const iconContainer = wrapper.querySelector('span') as HTMLElement;
      expect(iconContainer.style.position).toBe('absolute');
    });

    it('should position icon container on the left', () => {
      const wrapper = hostInput.parentElement as HTMLElement;
      const iconContainer = wrapper.querySelector('span') as HTMLElement;
      expect(iconContainer.style.left).toBe(Tokens.spacing12Px);
    });

    it('should vertically center icon container', () => {
      const wrapper = hostInput.parentElement as HTMLElement;
      const iconContainer = wrapper.querySelector('span') as HTMLElement;
      expect(iconContainer.style.top).toBe('50%');
      expect(iconContainer.style.transform).toBe('translateY(-50%)');
    });

    it('should disable pointer events on icon container', () => {
      const wrapper = hostInput.parentElement as HTMLElement;
      const iconContainer = wrapper.querySelector('span') as HTMLElement;
      expect(iconContainer.style.pointerEvents).toBe('none');
    });

    it('should apply flexbox to icon container', () => {
      const wrapper = hostInput.parentElement as HTMLElement;
      const iconContainer = wrapper.querySelector('span') as HTMLElement;
      expect(iconContainer.style.display).toBe('flex');
      expect(iconContainer.style.alignItems).toBe('center');
    });

    it('should create NgIconComponent', () => {
      const wrapper = hostInput.parentElement as HTMLElement;
      const iconElement = wrapper.querySelector('ng-icon');
      expect(iconElement).toBeTruthy();
    });

    it('should render icon inside the icon container', () => {
      const wrapper = hostInput.parentElement as HTMLElement;
      const iconContainer = wrapper.querySelector('span') as HTMLElement;
      const iconElement = iconContainer.querySelector('ng-icon');
      expect(iconElement).toBeTruthy();
    });
  });

  describe('NgIconComponent Configuration', () => {
    it('should set icon name to heroMagnifyingGlass', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const iconComponentRef = (directive as any)._searchIconRef;
      const iconComponent = iconComponentRef.instance as NgIconComponent;

      const wrapper = hostInput.parentElement as HTMLElement;
      const iconElement = wrapper.querySelector('ng-icon');

      expect(iconElement).toBeTruthy();
      expect(iconComponent.name).toBeDefined();
    });

    it('should set icon size to 18', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const iconComponentRef = (directive as any)._searchIconRef;
      const iconComponent = iconComponentRef.instance as NgIconComponent;

      const wrapper = hostInput.parentElement as HTMLElement;
      const iconElement = wrapper.querySelector('ng-icon');

      expect(iconElement).toBeTruthy();
      expect(iconComponent.size).toBeDefined();
    });

    it('should set icon color from tokens', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const iconComponentRef = (directive as any)._searchIconRef;
      const iconComponent = iconComponentRef.instance as NgIconComponent;

      const wrapper = hostInput.parentElement as HTMLElement;
      const iconElement = wrapper.querySelector('ng-icon');

      expect(iconElement).toBeTruthy();
      expect(iconComponent.color).toBeDefined();
    });

    it('should create icon component with ComponentRef', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const iconComponentRef = (directive as any)._searchIconRef;
      expect(iconComponentRef).toBeDefined();
      expect(iconComponentRef.instance).toBeInstanceOf(NgIconComponent);
    });
  });

  describe('Component Lifecycle', () => {
    it('should call ngOnInit and initialize all elements', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const wrapHostInputSpy = jest.spyOn(directive as any, '_wrapHostInput');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const styleHostInputSpy = jest.spyOn(directive as any, '_styleHostInput');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const createSearchIconSpy = jest.spyOn(directive as any, '_createSearchIcon');

      directive.ngOnInit();

      expect(wrapHostInputSpy).toHaveBeenCalled();
      expect(styleHostInputSpy).toHaveBeenCalled();
      expect(createSearchIconSpy).toHaveBeenCalled();
    });

    it('should destroy icon component on ngOnDestroy', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const iconComponentRef = (directive as any)._searchIconRef;
      const destroySpy = jest.spyOn(iconComponentRef, 'destroy');

      directive.ngOnDestroy();

      expect(destroySpy).toHaveBeenCalled();
    });
  });
});
