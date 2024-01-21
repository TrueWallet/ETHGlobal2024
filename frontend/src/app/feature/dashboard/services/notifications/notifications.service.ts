import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import { NotificationComponent } from "../../../../core/components/notification/notification.component";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  readonly defaultConfig: MatSnackBarConfig;

  constructor(private snackbar: MatSnackBar) {
    this.defaultConfig = {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    }
  }

  success(data: {title: string, message: string}, overrides: MatSnackBarConfig = {}): void {
    this.snackbar.openFromComponent(NotificationComponent, {
      ...this.defaultConfig,
      ...overrides,
      data: {
        type: 'success',
        title: data.title,
        message: data.message,
      },
    })
  }

  warning(data: {title: string, message: string}, overrides: MatSnackBarConfig = {}): void {
    this.snackbar.openFromComponent(NotificationComponent, {
      ...this.defaultConfig,
      ...overrides,
      data: {
        type: 'warning',
        title: data.title,
        message: data.message,
      },
    })
  }
}
