import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  private loadingSubs!: Subscription;

  constructor(
    private auth: AuthService,
    private ui: UIService
  ) { }

  ngOnInit(): void {
    this.loadingSubs = this.ui.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading
    });
  }

  onSubmit(form: NgForm) {
    this.auth.login({
      email: form.value.email,
      password: form.value.password
    });
  }

  ngOnDestroy() {
    this.loadingSubs?.unsubscribe();
  }
}
