import { Subject, Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Exercise } from "./exercise.model";
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class TrainingService {
  trainingChanged = new Subject<Exercise | null>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();

  private availableExercises: Exercise[] = [];
  private runningExercise?: Exercise | null;
  private subscriptions: Subscription[] = [];

  constructor(private db: AngularFirestore) { }

  cancelSubscriptions() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  fetchAvailableExercises() {
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
          console.log(exercises);
          this.availableExercises = exercises;
          this.exercisesChanged.next([...this.availableExercises]);
        },
          error => console.log(error)
        ));
  }

  fetchCompletedOrCancelledExercises() {
    this.subscriptions.push(this.db
      .collection('finishedExercises')
      .valueChanges()
      .subscribe(exercises => {
        this.finishedExercisesChanged.next(exercises as Exercise[]);
      },
        error => console.log(error)
      ));
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(e => e.id === selectedId)!;
    this.trainingChanged.next({ ...this.runningExercise });
  }

  completeExercise() {
    this.addDataToDatabase({
      ...this.runningExercise!,
      date: new Date(),
      duration: this.runningExercise!.duration,
      calories: this.runningExercise!.calories,
      state: 'completed'
    });
    this.runningExercise = null;
    this.trainingChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({
      ...this.runningExercise!,
      duration: this.runningExercise!.duration * (progress / 100),
      date: new Date(),
      calories: this.runningExercise!.calories * (progress / 100),
      state: 'cancelled'
    });
    this.runningExercise = null;
    this.trainingChanged.next(null);
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }
}