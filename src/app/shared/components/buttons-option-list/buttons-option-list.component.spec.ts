/* eslint-disable @typescript-eslint/no-explicit-any */
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonOption } from '@models';
import { ButtonsOptionListComponent } from './buttons-option-list.component';

describe('ButtonsOptionListComponent', () => {
  let component: ButtonsOptionListComponent;
  let fixture: ComponentFixture<ButtonsOptionListComponent>;

  const mockOptions: ButtonOption[] = [
    { label: 'Option A', value: 'optionA' },
    { label: 'Option B', value: 'optionB' },
    { label: 'Option C', value: 'optionC' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonsOptionListComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonsOptionListComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('label', 'Test Label');
    fixture.componentRef.setInput('options', mockOptions);

    fixture.autoDetectChanges();
  });

  describe('Component Initialization', () => {
    it('should load', () => {
      expect(component).toBeTruthy();
    });

    it('should throw error if options array is empty', () => {
      expect(() => {
        fixture.componentRef.setInput('options', []);
      }).toThrow('ButtonsOptionListComponent requires at least 1 option in options array');
    });
  });

  describe('ControlValueAccessor Implementation', () => {
    it('should register onChange callback', () => {
      const fn = jest.fn();
      component.registerOnChange(fn);

      component.selectedOptions = ['optionA'];

      expect(fn).toHaveBeenCalledWith(['optionA']);
    });

    it('should register onTouched callback', () => {
      const fn = jest.fn();
      component.registerOnTouched(fn);

      component.selectedOptions = ['optionA'];

      expect(fn).toHaveBeenCalled();
    });

    it('should write value', () => {
      component.writeValue(['optionA', 'optionB']);

      expect(component.selectedOptions).toEqual(['optionA', 'optionB']);
    });

    it('should handle null writeValue', () => {
      component.writeValue(null as any);

      expect(component.selectedOptions).toBeNull();
    });

    it('should handle undefined writeValue', () => {
      component.writeValue(undefined as any);

      expect(component.selectedOptions).toBeUndefined();
    });
  });

  describe('isOptionSelected', () => {
    it('should return false when no options are selected', () => {
      expect(component.isOptionSelected('optionA')).toBe(false);
    });

    it('should return true when option is selected', () => {
      component.selectedOptions = ['optionA'];

      expect(component.isOptionSelected('optionA')).toBe(true);
    });

    it('should return false when option is not selected', () => {
      component.selectedOptions = ['optionA'];

      expect(component.isOptionSelected('optionB')).toBe(false);
    });

    it('should handle multiple selected options', () => {
      component.selectedOptions = ['optionA', 'optionB'];

      expect(component.isOptionSelected('optionA')).toBe(true);
      expect(component.isOptionSelected('optionB')).toBe(true);
      expect(component.isOptionSelected('optionC')).toBe(false);
    });
  });

  describe('toggleOption - Single Selection Mode', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('multiSelectable', false);
    });

    it('should select an option when none are selected', () => {
      const onChangeSpy = jest.fn();
      component.registerOnChange(onChangeSpy);

      component.toggleOption('optionA');

      expect(component.selectedOptions).toEqual(['optionA']);
      expect(onChangeSpy).toHaveBeenCalledWith(['optionA']);
    });

    it('should replace selection with new option', () => {
      component.selectedOptions = ['optionA'];

      component.toggleOption('optionB');

      expect(component.selectedOptions).toEqual(['optionB']);
    });

    it('should deselect option if allowVoidSelection is true', () => {
      fixture.componentRef.setInput('allowVoidSelection', true);
      component.selectedOptions = ['optionA'];

      component.toggleOption('optionA');

      expect(component.selectedOptions).toEqual([]);
    });

    it('should not deselect option if allowVoidSelection is false and only one option selected', () => {
      fixture.componentRef.setInput('allowVoidSelection', false);
      component.selectedOptions = ['optionA'];

      component.toggleOption('optionA');

      expect(component.selectedOptions).toEqual(['optionA']);
    });

    it('should set activeDescendant', () => {
      component.toggleOption('optionB');

      expect(component.activeDescendant).toBe('optionB');
    });
  });

  describe('toggleOption - Multi Selection Mode', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('multiSelectable', true);
    });

    it('should add option to selection', () => {
      component.toggleOption('optionA');

      expect(component.selectedOptions).toEqual(['optionA']);
    });

    it('should add multiple options to selection', () => {
      component.toggleOption('optionA');
      component.toggleOption('optionB');

      expect(component.selectedOptions).toEqual(['optionA', 'optionB']);
    });

    it('should remove option from selection', () => {
      component.selectedOptions = ['optionA', 'optionB'];

      component.toggleOption('optionA');

      expect(component.selectedOptions).toEqual(['optionB']);
    });

    it('should handle toggling same option multiple times', () => {
      component.toggleOption('optionA');
      component.toggleOption('optionA');
      component.toggleOption('optionA');

      expect(component.selectedOptions).toEqual(['optionA']);
    });

    it('should remove duplicates from selection', () => {
      component.selectedOptions = ['optionA'];

      component.toggleOption('optionB');

      expect(component.selectedOptions).toEqual(['optionA', 'optionB']);
    });

    it('should allow deselecting all options when allowVoidSelection is true', () => {
      fixture.componentRef.setInput('allowVoidSelection', true);
      component.selectedOptions = ['optionA'];

      component.toggleOption('optionA');

      expect(component.selectedOptions).toEqual([]);
    });

    it('should not allow deselecting last option when allowVoidSelection is false', () => {
      fixture.componentRef.setInput('allowVoidSelection', false);
      component.selectedOptions = ['optionA'];

      component.toggleOption('optionA');

      expect(component.selectedOptions).toEqual(['optionA']);
    });

    it('should allow deselecting option when multiple selected and allowVoidSelection is false', () => {
      fixture.componentRef.setInput('allowVoidSelection', false);
      component.selectedOptions = ['optionA', 'optionB'];

      component.toggleOption('optionA');

      expect(component.selectedOptions).toEqual(['optionB']);
    });
  });

  describe('selectedOptions setter', () => {
    it('should trigger onChange callback', () => {
      const onChangeSpy = jest.fn();
      component.registerOnChange(onChangeSpy);

      component.selectedOptions = ['optionA'];

      expect(onChangeSpy).toHaveBeenCalledWith(['optionA']);
    });

    it('should trigger onTouched callback', () => {
      const onTouchedSpy = jest.fn();
      component.registerOnTouched(onTouchedSpy);

      component.selectedOptions = ['optionA'];

      expect(onTouchedSpy).toHaveBeenCalled();
    });
  });
});
