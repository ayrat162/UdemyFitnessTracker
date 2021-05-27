import { Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Exercise } from "./exercise.model";
import { map } from 'rxjs/operators';

export class TrainingService {
  trainingChanged = new Subject<Exercise | null>();
  exercisesChanged = new Subject<Exercise[]>();

  private availableExercises: Exercise[] = [];
  private runningExercise?: Exercise | null;
  private exercises: Exercise[] = [];

  constructor(private db: AngularFirestore ){}

  fetchAvailableExercises() {
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
        this.availableExercises = exercises;
        this.exercisesChanged.next([...this.availableExercises]);
      }
      );
  }

  getCompletedOrCancelledExercises() {
    return this.exercises.slice();  
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(e => e.id === selectedId)!;
    this.trainingChanged.next({ ...this.runningExercise });
  }

  completeExercise() {
    this.exercises.push({ 
      ...this.runningExercise!,
      date: new Date(), 
      duration: this.runningExercise!.duration,
      calories: this.runningExercise!.calories,
      state: 'completed' });
    this.runningExercise = null;
    this.trainingChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.exercises.push({ 
      ...this.runningExercise!,
      duration: this.runningExercise!.duration * (progress / 100),
      date: new Date(), 
      calories: this.runningExercise!.calories * (progress / 100),
      state: 'cancelled' });
    this.runningExercise = null;
    this.trainingChanged.next(null);
  }
}