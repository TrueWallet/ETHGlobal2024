import { Component, Inject, Input, Optional } from '@angular/core';
import { AsyncPipe, NgClass, NgIf, NgSwitch, NgSwitchCase } from "@angular/common";
import { MAT_SNACK_BAR_DATA } from "@angular/material/snack-bar";

export type NotificationType = 'success'| 'warning';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
    NgSwitch,
    NgSwitchCase,
    NgClass
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {
  @Input() type: NotificationType = 'success';
  @Input() title: string = '';
  @Input() message: string = '';

  constructor(@Optional() @Inject(MAT_SNACK_BAR_DATA) data: {title: string, message: string}) {
    if (data) {
      this.title = data.title;
      this.message = data.message;
    }
  }
}
