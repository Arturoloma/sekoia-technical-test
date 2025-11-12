import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'sek-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
  public textContent = input.required<string>();
}
