import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'skio-joke-list',
  templateUrl: './joke-list.component.html',
  styleUrls: ['./joke-list.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JokeListComponent {
  // Homepage with search, filters, and joke listing
  // Requirements:
  // - Searchbar
  // - Submit button (navigates to /submit)
  // - List 10 jokes
  // - Filter checkboxes (nsfw, religious, political, racist, sexist, explicit)
}
