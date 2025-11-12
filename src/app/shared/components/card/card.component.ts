import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'sek-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {}
