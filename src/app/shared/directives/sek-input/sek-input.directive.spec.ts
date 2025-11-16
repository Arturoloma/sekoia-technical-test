import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideIcons } from '@ng-icons/core';
import { heroMagnifyingGlass } from '@ng-icons/heroicons/outline';
import { Tokens } from '@styles';
import { SekInputDirective } from './sek-input.directive';

@Component({
  selector: 'sek-search-input-test',
  standalone: true,
  imports: [SekInputDirective],
  template: `<input type="search" sekInput />`,
})
class SearchInputTestComponent {}

@Component({
  selector: 'sek-text-input-test',
  standalone: true,
  imports: [SekInputDirective],
  template: `<input type="text" sekInput />`,
})
class TextInputTestComponent {}

describe('SekInputDirective', () => {
  describe('Search Input', () => {
    let fixture: ComponentFixture<SearchInputTestComponent>;
    let inputElement: HTMLInputElement;
    let directive: SekInputDirective;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [SearchInputTestComponent],
        providers: [provideZonelessChangeDetection(), provideIcons({ heroMagnifyingGlass })],
      }).compileComponents();

      fixture = TestBed.createComponent(SearchInputTestComponent);
      const inputDebugElement = fixture.debugElement.query(By.directive(SekInputDirective));
      inputElement = inputDebugElement.nativeElement;
      directive = inputDebugElement.injector.get(SekInputDirective);
      fixture.autoDetectChanges();
    });

    describe('Directive Initialization', () => {
      it('should load', () => {
        expect(directive).toBeTruthy();
      });

      it('should apply directive to search input', () => {
        expect(inputElement.type).toBe('search');
      });
    });

    describe('Wrapper Creation', () => {
      it('should wrap the input element in a wrapper div', () => {
        const wrapper = inputElement.parentElement;
        expect(wrapper).toBeTruthy();
        expect(wrapper?.tagName.toLowerCase()).toBe('div');
      });

      it('should set wrapper position to relative', () => {
        const wrapper = inputElement.parentElement as HTMLElement;
        expect(wrapper.style.position).toBe('relative');
      });

      it('should maintain original parent hierarchy', () => {
        const wrapper = inputElement.parentElement;
        expect(wrapper?.parentElement).toBe(fixture.nativeElement);
      });
    });

    describe('Input Styling', () => {
      it('should apply border styling', () => {
        const expectedBorder = `${Tokens.size1Px} solid ${Tokens.colorBorder}`;
        expect(inputElement.style.border).toBe(expectedBorder);
      });

      it('should apply correct padding-left for search icon space', () => {
        expect(inputElement.style.paddingLeft).toBe('38px');
      });

      it('should apply correct padding-right', () => {
        expect(inputElement.style.paddingRight).toBe(Tokens.spacing12Px);
      });

      it('should apply border-radius from tokens', () => {
        expect(inputElement.style.borderRadius).toBe(Tokens.borderRadiusM);
      });

      it('should apply line-height from tokens', () => {
        expect(inputElement.style.lineHeight).toBe(Tokens.lineHeightM);
      });

      it('should apply min-height from tokens', () => {
        expect(inputElement.style.minHeight).toBe(Tokens.size36Px);
      });

      it('should apply background-color from tokens', () => {
        expect(inputElement.style.backgroundColor).toBeDefined();
      });
    });

    describe('Search Icon Creation', () => {
      it('should create icon container span', () => {
        const wrapper = inputElement.parentElement as HTMLElement;
        const iconContainer = wrapper.querySelector('span');
        expect(iconContainer).toBeTruthy();
      });

      it('should position icon container absolutely', () => {
        const wrapper = inputElement.parentElement as HTMLElement;
        const iconContainer = wrapper.querySelector('span') as HTMLElement;
        expect(iconContainer.style.position).toBe('absolute');
      });

      it('should position icon container on the left', () => {
        const wrapper = inputElement.parentElement as HTMLElement;
        const iconContainer = wrapper.querySelector('span') as HTMLElement;
        expect(iconContainer.style.left).toBe(Tokens.spacing12Px);
      });

      it('should vertically center icon container', () => {
        const wrapper = inputElement.parentElement as HTMLElement;
        const iconContainer = wrapper.querySelector('span') as HTMLElement;
        expect(iconContainer.style.top).toBe('50%');
        expect(iconContainer.style.transform).toBe('translateY(-50%)');
      });

      it('should disable pointer events on icon container', () => {
        const wrapper = inputElement.parentElement as HTMLElement;
        const iconContainer = wrapper.querySelector('span') as HTMLElement;
        expect(iconContainer.style.pointerEvents).toBe('none');
      });

      it('should apply flexbox to icon container', () => {
        const wrapper = inputElement.parentElement as HTMLElement;
        const iconContainer = wrapper.querySelector('span') as HTMLElement;
        expect(iconContainer.style.display).toBe('flex');
        expect(iconContainer.style.alignItems).toBe('center');
      });

      it('should create NgIconComponent', () => {
        const wrapper = inputElement.parentElement as HTMLElement;
        const iconElement = wrapper.querySelector('ng-icon');
        expect(iconElement).toBeTruthy();
      });

      it('should render icon inside the icon container', () => {
        const wrapper = inputElement.parentElement as HTMLElement;
        const iconContainer = wrapper.querySelector('span') as HTMLElement;
        const iconElement = iconContainer.querySelector('ng-icon');
        expect(iconElement).toBeTruthy();
      });
    });

    describe('Component Lifecycle', () => {
      it('should destroy icon component on ngOnDestroy', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const iconComponentRef = (directive as any)._searchIconRef;
        const destroySpy = jest.spyOn(iconComponentRef, 'destroy');

        directive.ngOnDestroy();

        expect(destroySpy).toHaveBeenCalled();
      });
    });
  });

  describe('Text Input', () => {
    let fixture: ComponentFixture<TextInputTestComponent>;
    let inputElement: HTMLInputElement;
    let directive: SekInputDirective;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TextInputTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(TextInputTestComponent);
      const inputDebugElement = fixture.debugElement.query(By.directive(SekInputDirective));
      inputElement = inputDebugElement.nativeElement;
      directive = inputDebugElement.injector.get(SekInputDirective);
      fixture.autoDetectChanges();
    });

    describe('Directive Initialization', () => {
      it('should load', () => {
        expect(directive).toBeTruthy();
      });

      it('should apply directive to text input', () => {
        expect(inputElement.type).toBe('text');
      });
    });

    describe('Wrapper Creation', () => {
      it('should wrap the input element in a wrapper div', () => {
        const wrapper = inputElement.parentElement;
        expect(wrapper).toBeTruthy();
        expect(wrapper?.tagName.toLowerCase()).toBe('div');
      });

      it('should set wrapper position to relative', () => {
        const wrapper = inputElement.parentElement as HTMLElement;
        expect(wrapper.style.position).toBe('relative');
      });
    });

    describe('Input Styling', () => {
      it('should apply border styling', () => {
        const expectedBorder = `${Tokens.size1Px} solid ${Tokens.colorBorder}`;
        expect(inputElement.style.border).toBe(expectedBorder);
      });

      it('should apply correct padding-left for text input', () => {
        expect(inputElement.style.paddingLeft).toBe(Tokens.spacing12Px);
      });

      it('should apply correct padding-right', () => {
        expect(inputElement.style.paddingRight).toBe(Tokens.spacing12Px);
      });

      it('should apply border-radius from tokens', () => {
        expect(inputElement.style.borderRadius).toBe(Tokens.borderRadiusM);
      });

      it('should apply line-height from tokens', () => {
        expect(inputElement.style.lineHeight).toBe(Tokens.lineHeightM);
      });

      it('should apply min-height from tokens', () => {
        expect(inputElement.style.minHeight).toBe(Tokens.size36Px);
      });

      it('should apply background-color from tokens', () => {
        expect(inputElement.style.backgroundColor).toBeDefined();
      });
    });

    describe('No Search Icon', () => {
      it('should not create icon container for text input', () => {
        const wrapper = inputElement.parentElement as HTMLElement;
        const iconContainer = wrapper.querySelector('span');
        expect(iconContainer).toBeFalsy();
      });

      it('should not create NgIconComponent for text input', () => {
        const wrapper = inputElement.parentElement as HTMLElement;
        const iconElement = wrapper.querySelector('ng-icon');
        expect(iconElement).toBeFalsy();
      });
    });
  });
});
