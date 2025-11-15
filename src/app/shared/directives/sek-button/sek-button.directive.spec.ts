import { Component, DebugElement, input, ViewContainerRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Tokens } from '@styles';
import { SekButtonDirective } from './sek-button.directive';

@Component({
  selector: 'sek-search-input-directive-test',
  standalone: true,
  imports: [SekButtonDirective],
  template: `<button sekButton [active]="active()">Sek button</button>`,
})
class SekButtonDirectiveTestComponent {
  public active = input<boolean>(false);
}

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

    it('should have active input defaulting to false', () => {
      expect(directive.active()).toBe(false);
    });
  });

  describe('Static Host Styling', () => {
    it('should apply the expected border radius', () => {
      expect(host.style.borderRadius).toBe(Tokens.borderRadiusM);
    });

    it('should apply the expected minimum width', () => {
      expect(host.style.minWidth).toBe(Tokens.size36Px);
    });

    it('should apply the expected height', () => {
      expect(host.style.height).toBe(Tokens.size36Px);
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

  describe('Inactive State Styling (default)', () => {
    it('should apply inactive background color', () => {
      expect(host.style.backgroundColor).toBeDefined();
      expect(host.style.backgroundColor).not.toBe('');
    });

    it('should apply inactive text color', () => {
      expect(host.style.color).toBeDefined();
      expect(host.style.color).not.toBe('');
    });

    it('should apply inactive border styling', () => {
      expect(host.style.border).toContain('1px');
      expect(host.style.border).toContain('solid');
    });
  });

  describe('Active State Styling', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('active', true);
      fixture.detectChanges();
    });

    it('should apply active background color', () => {
      expect(host.style.backgroundColor).toBeDefined();
      expect(host.style.backgroundColor).not.toBe('');
    });

    it('should apply active text color', () => {
      expect(host.style.color).toBeDefined();
      expect(host.style.color).not.toBe('');
    });

    it('should apply active border styling', () => {
      expect(host.style.border).toContain('1px');
      expect(host.style.border).toContain('solid');
    });
  });
});
