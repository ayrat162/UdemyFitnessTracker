import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TrainingService } from '../training.service';
import { Observable } from 'rxjs';
import { Exercise } from '../exercise.model';
import * as fromTraining from '../../training/training.reducer';
import * as fromRoot from '../../app.reducer';
import { Store } from '@ngrx/store';
import { StartLoading } from 'src/app/shared/ui.actions';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  isLoading$!: Observable<boolean>;
  exercises$!: Observable<Exercise[]>;

  constructor(
    private trainingService: TrainingService,
    private store: Store<fromTraining.State>
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.exercises$ = this.store.select(fromTraining.getAvailableExercises);

    this.store.dispatch(new StartLoading());
    this.trainingService.fetchAvailableExercises();
  }

  onTrainingStart(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise)
  }
}
