import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Store } from '@ngrx/store';

import { AuthData } from "./auth-data.model";
import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';
import * as fromRoot from '../app.reducer';
import { StartLoading, StopLoading } from '../shared/ui.actions';
import { SetAuthenticated, SetUnauthenticated } from './auth.actions';

@Injectable()
export class AuthService {
  constructor(
    private router: Router,
    private fireAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private ui: UIService,
    private store: Store<fromRoot.State>

  ) { }

  initAuthListener() {
    this.fireAuth.authState.subscribe(user => {
      console.log(user?.email);
      if (user) {
        this.store.dispatch(new SetAuthenticated())
        this.router.navigate(['/training']);
      } else {
        this.store.dispatch(new SetUnauthenticated())
        this.trainingService.cancelSubscriptions();
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData) {
    // this.store.dispatch(new StartLoading());
    this.fireAuth.createUserWithEmailAndPassword(authData.email, authData.password)
      .then(() => {
        // this.store.dispatch(new StopLoading());
      })
      .catch(
        error => {
          // this.store.dispatch(new StopLoading());
          this.ui.showError(error);
        }
      );
  }

  login(authData: AuthData) {
    this.store.dispatch(new StartLoading());
    this.fireAuth.signInWithEmailAndPassword(authData.email, authData.password)
      .then(() => {
        // this.store.dispatch(new StopLoading());
      })
      .catch(
        error => {
          this.ui.showError(error)
          // this.store.dispatch(new StopLoading());
        }
      );
  }

  logout() {
    this.fireAuth.signOut();
  }
}