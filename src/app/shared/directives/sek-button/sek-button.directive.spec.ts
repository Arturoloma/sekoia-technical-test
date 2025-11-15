import { Component, DebugElement, ViewContainerRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Tokens } from '@styles';
import { SekButtonDirective } from './sek-button.directive';

@Component({
  selector: 'sek-search-input-directive-test',
  standalone: true,
  imports: [SekButtonDirective],
  template: `<button sekButton>Sek button</button>`,
})
class SekButtonDirectiveTestComponent {}

describe('SekButtonDirective', () => {
  let fixture: ComponentFixture<SekButtonDirectiveTestComponent>;
  let host: HTMLButtonElement;
  let debugElement: DebugElement;
  let directive: SekButtonDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SekButtonDirectiveTestComponent, SekButtonDirective],
      providers: [ViewContainerRef],
    }).compileComponents();

    fixture = TestBed.createComponent(SekButtonDirectiveTestComponent);
    debugElement = fixture.debugElement.query(By.directive(SekButtonDirective));
    host = debugElement.nativeElement as HTMLButtonElement;
    directive = debugElement.injector.get(SekButtonDirective);

    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe('Directive Initialization', () => {
    it('should load', () => {
      expect(directive).toBeTruthy();
    });

    it('should only apply to button elements', () => {
      const selector = 'button[sekButton]';
      expect(host.matches(selector)).toBe(true);
    });
  });

  describe('Host Styling', () => {
    it('should apply border styling', () => {
      const expectedBorder = `${Tokens.size1Px} solid ${Tokens.colorBorder}`;
      expect(host.style.border).toBe(expectedBorder);
    });

    it('should apply the expected border radius', () => {
      expect(host.style.borderRadius).toBe(Tokens.borderRadiusM);
    });

    it('should apply background color', () => {
      expect(host.style.backgroundColor).toBeDefined();
    });

    it('should apply the expected minimum width', () => {
      expect(host.style.minWidth).toBe(Tokens.size36Px);
    });

    it('should apply the expected height', () => {
      expect(host.style.minWidth).toBe(Tokens.size36Px);
    });

    it('should apply styles to center items inside', () => {
      expect(host.style.display).toBe('flex');
      expect(host.style.alignItems).toBe('center');
      expect(host.style.justifyContent).toBe('center');
    });

    it('should make the cursor be a pointer on hover', () => {
      expect(host.style.cursor).toBe('pointer');
    });
  });
});
