import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TrainingService } from '../training.service';
import { Observable, Subscription } from 'rxjs';
import { Exercise } from '../exercise.model';
import * as fromRoot from '../../app.reducer';
import { Store } from '@ngrx/store';
import { StartLoading, StopLoading } from 'src/app/shared/ui.actions';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises!: Exercise[];
  subscriptions: Subscription[] = [];

  isLoading$!: Observable<boolean>;

  constructor(
    private trainingService: TrainingService,
    private store: Store<fromRoot.State>
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.store.dispatch(new StartLoading());
    this.subscriptions.push(
      this.trainingService.exercisesChanged.subscribe(exercises => {
        this.exercises = exercises;
      })
    );
    this.trainingService.fetchAvailableExercises();
  }

  onTrainingStart(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise)
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => { s?.unsubscribe() });
  }
}
