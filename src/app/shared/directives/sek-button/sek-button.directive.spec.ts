import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Tokens } from '@styles';
import { SekButtonDirective } from './sek-button.directive';

@Component({
  selector: 'sek-button-inactive-test',
  template: `<button sekButton [active]="false" [disabled]="false">Test</button>`,
  standalone: true,
  imports: [SekButtonDirective],
})
class InactiveButtonTestComponent {}

@Component({
  selector: 'sek-button-active-test',
  template: `<button sekButton [active]="true" [disabled]="false">Test</button>`,
  standalone: true,
  imports: [SekButtonDirective],
})
class ActiveButtonTestComponent {}

@Component({
  selector: 'sek-button-disabled-test',
  template: `<button sekButton [active]="false" [disabled]="true">Test</button>`,
  standalone: true,
  imports: [SekButtonDirective],
})
class DisabledButtonTestComponent {}

@Component({
  selector: 'sek-button-active-disabled-test',
  template: `<button sekButton [active]="true" [disabled]="true">Test</button>`,
  standalone: true,
  imports: [SekButtonDirective],
})
class ActiveDisabledButtonTestComponent {}

describe('SekButtonDirective', () => {
  describe('Component Initialization', () => {
    let fixture: ComponentFixture<InactiveButtonTestComponent>;
    let buttonElement: HTMLButtonElement;
    let directive: SekButtonDirective;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [InactiveButtonTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(InactiveButtonTestComponent);
      const buttonDebugElement = fixture.debugElement.query(By.directive(SekButtonDirective));
      buttonElement = buttonDebugElement.nativeElement;
      directive = buttonDebugElement.injector.get(SekButtonDirective);
      fixture.autoDetectChanges();
    });

    it('should load', () => {
      expect(directive).toBeTruthy();
    });

    it('should be applied to button element', () => {
      expect(buttonElement.tagName).toBe('BUTTON');
    });
  });

  describe('Initial Styling', () => {
    let fixture: ComponentFixture<InactiveButtonTestComponent>;
    let buttonElement: HTMLButtonElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [InactiveButtonTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(InactiveButtonTestComponent);
      const buttonDebugElement = fixture.debugElement.query(By.directive(SekButtonDirective));
      buttonElement = buttonDebugElement.nativeElement;
      fixture.autoDetectChanges();
    });

    it('should apply base button styles on init', () => {
      expect(buttonElement.style.borderRadius).toBe(Tokens.borderRadiusM);
      expect(buttonElement.style.minWidth).toBe(Tokens.size36Px);
      expect(buttonElement.style.height).toBe(Tokens.size36Px);
      expect(buttonElement.style.display).toBe('flex');
      expect(buttonElement.style.alignItems).toBe('center');
      expect(buttonElement.style.justifyContent).toBe('center');
    });

    it('should apply default inactive styles', () => {
      expect(buttonElement.style.backgroundColor).toBeDefined();
      expect(buttonElement.style.color).toBeDefined();
      expect(buttonElement.style.border).toBeDefined();
      expect(buttonElement.style.cursor).toBe('pointer');
    });
  });

  describe('Active State Styling', () => {
    let fixture: ComponentFixture<ActiveButtonTestComponent>;
    let buttonElement: HTMLButtonElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ActiveButtonTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(ActiveButtonTestComponent);
      const buttonDebugElement = fixture.debugElement.query(By.directive(SekButtonDirective));
      buttonElement = buttonDebugElement.nativeElement;
      fixture.autoDetectChanges();
    });

    it('should apply active styles when active input is true', () => {
      expect(buttonElement.style.backgroundColor).toBeDefined();
      expect(buttonElement.style.color).toBeDefined();
      expect(buttonElement.style.border).toBeDefined();
    });

    it('should maintain base styles when active', () => {
      expect(buttonElement.style.borderRadius).toBe(Tokens.borderRadiusM);
      expect(buttonElement.style.minWidth).toBe(Tokens.size36Px);
      expect(buttonElement.style.height).toBe(Tokens.size36Px);
    });
  });

  describe('Disabled State Styling', () => {
    let fixture: ComponentFixture<DisabledButtonTestComponent>;
    let buttonElement: HTMLButtonElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [DisabledButtonTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(DisabledButtonTestComponent);
      const buttonDebugElement = fixture.debugElement.query(By.directive(SekButtonDirective));
      buttonElement = buttonDebugElement.nativeElement;
      fixture.autoDetectChanges();
    });

    it('should apply disabled styles when disabled input is true', () => {
      expect(buttonElement.style.opacity).toBe('0.5');
      expect(buttonElement.style.cursor).toBe('not-allowed');
      expect(buttonElement.style.pointerEvents).toBe('none');
    });

    it('should maintain base styles when disabled', () => {
      expect(buttonElement.style.display).toBe('flex');
      expect(buttonElement.style.alignItems).toBe('center');
      expect(buttonElement.style.justifyContent).toBe('center');
    });
  });

  describe('Combined Active and Disabled States', () => {
    let fixture: ComponentFixture<ActiveDisabledButtonTestComponent>;
    let buttonElement: HTMLButtonElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ActiveDisabledButtonTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(ActiveDisabledButtonTestComponent);
      const buttonDebugElement = fixture.debugElement.query(By.directive(SekButtonDirective));
      buttonElement = buttonDebugElement.nativeElement;
      fixture.autoDetectChanges();
    });

    it('should apply both active and disabled styles when both inputs are true', () => {
      expect(buttonElement.style.backgroundColor).toBeDefined();
      expect(buttonElement.style.opacity).toBe('0.5');
      expect(buttonElement.style.cursor).toBe('not-allowed');
      expect(buttonElement.style.pointerEvents).toBe('none');
    });
  });
});
