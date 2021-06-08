import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

@Injectable()
export class UIService {
  constructor(
    private snackbar: MatSnackBar
  ) { }

  loadingStateChanged = new Subject<boolean>();

  showError(error: any) {
    this.showSnackbar(error.message, undefined, 3000);
  }

  showSnackbar(message: string, action: string | undefined, duration: number) {
    this.snackbar.open(message, action, { duration: duration });
  }
}