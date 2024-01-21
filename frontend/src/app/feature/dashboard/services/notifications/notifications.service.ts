import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  readonly defaultConfig: MatSnackBarConfig;

  constructor(private snackbar: MatSnackBar) {
    this.defaultConfig = {
      duration: 0,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    }
  }

  success(message: string, overrides: MatSnackBarConfig = {}): void {
    this.snackbar.open(message, 'OK', Object.assign(this.defaultConfig, overrides, {
      panelClass: ['success-alert'],
    }));
  }
}
