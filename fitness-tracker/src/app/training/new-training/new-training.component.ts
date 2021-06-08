import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TrainingService } from '../training.service';
import { Subscription } from 'rxjs';
import { Exercise } from '../exercise.model';
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises!: Exercise[];
  subscriptions: Subscription[] = [];

  isLoading = true;

  constructor(
    private trainingService: TrainingService,
    private ui: UIService
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.ui.loadingStateChanged.subscribe(isLoading => {
        this.isLoading = isLoading;
      })
    );
    this.subscriptions.push(
      this.trainingService.exercisesChanged.subscribe(exercises => {
        this.ui.loadingStateChanged.next(false);
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
