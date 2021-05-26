import { Subject } from "rxjs";
import { Exercise } from "./exercise.model";

export class TrainingService {
  trainingChanged = new Subject<Exercise | null>();

  private availableExercises: Exercise[] = [
    { id: 'crunches', name: 'Crunches', duration: 5, calories: 8 },
    { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
    { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
    { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 }
  ];

  private runningExercise?: Exercise | null;
  private exercises: Exercise[] = [];

  getAvailableExercises(): Exercise[] {
    return [...this.availableExercises];
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