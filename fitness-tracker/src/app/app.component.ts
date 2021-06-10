import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from './auth/auth.service';
import * as fromRoot from './app.reducer';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'fitness-tracker';
  openSidenav = false;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.initAuthListener();
  }
}
