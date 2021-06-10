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
  isAuth$!: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private store: Store<fromRoot.State>) {}

  ngOnInit(): void {
    this.isAuth$ = this.store.select(fromRoot.getIsAuth);
    this.authService.initAuthListener();
  }
}
