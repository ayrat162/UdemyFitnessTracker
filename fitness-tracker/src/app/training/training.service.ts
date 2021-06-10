import { Subject, Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Exercise } from "./exercise.model";
import { map, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { UIService } from '../shared/ui.service';
import * as fromTraining from '../training/training.reducer';
import { Store } from '@ngrx/store';
import * as UI from '../shared/ui.actions';
import * as Training from '../training/training.actions';

@Injectable()
export class TrainingService {
  private subscriptions: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private ui: UIService,
    private store: Store<fromTraining.State>
  ) { }

  cancelSubscriptions() {
    this.subscriptions.forEach(subscription => {
      subscription?.unsubscribe();
    });
  }

  fetchAvailableExercises() {
    this.store.dispatch(new UI.StartLoading())
    this.subscriptions.push(
      this.db
        .collection('availableExercises')
        .snapshotChanges()
        .pipe(
          map(docArray => {
            return docArray.map(doc => {
              const data: Exercise = doc.payload.doc.data() as Exercise;
              data.id = doc.payload.doc.id;
              return { ...data };
            });
          })
        ).subscribe((exercises: Exercise[]) => {
          this.store.dispatch(new UI.StopLoading());
          this.store.dispatch(new Training.SetAvailableExercises(exercises))
        },
          error => {
            this.store.dispatch(new UI.StopLoading());
            this.ui.showError(error)
          }
        ));
  }

  fetchCompletedOrCancelledExercises() {
    this.subscriptions.push(this.db
      .collection('finishedExercises')
      .valueChanges()
      .subscribe((exercises) => {
        this.store.dispatch(new Training.SetFinishedExercises(exercises as Exercise[]))
      },
        error => this.ui.showError(error)
      ));
  }

  startExercise(selectedId: string) {
    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  completeExercise() {
      this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(exercise => {
        this.addDataToDatabase({
          ...exercise!,
          date: new Date(),
          duration: exercise!.duration,
          calories: exercise!.calories,
          state: 'completed'
        });
        this.store.dispatch(new Training.StopTraining())
      })
  }

  cancelExercise(progress: number) {
      this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(exercise => {
        this.addDataToDatabase({
          ...exercise!,
          duration: exercise!.duration * (progress / 100),
          date: new Date(),
          calories: exercise!.calories * (progress / 100),
          state: 'cancelled'
        });
        this.store.dispatch(new Training.StopTraining())
      })
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }
}