import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { TrainingService } from '../training.service';
import { StopTrainingComponent } from './stop-training.component';

@Component({
  selector: 'app-current',
  templateUrl: './current.component.html',
  styleUrls: ['./current.component.css']
})
export class CurrentTrainingComponent implements OnInit, OnDestroy {
  progress = 0;
  timer: any;
  dialogSubscription!: Subscription;

  constructor(
    private dialog: MatDialog,
    private trainingService: TrainingService) { }

  ngOnInit(): void {
    this.startOrResumeTimer();
  }

  ngOnDestroy(): void {
    this.dialogSubscription?.unsubscribe();
  }

  startOrResumeTimer() {
    const step = this.trainingService.getRunningExercise().duration! * 10;
    this.timer = setInterval(() => {
      this.progress = this.progress + 1;
      if (this.progress >= 100) {
        this.trainingService.completeExercise();
        clearInterval(this.timer);
      }
    },
      step)
  }

  onStop(): void {
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: {
        progress: this.progress
      }
    });

    this.dialogSubscription = dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.trainingService.cancelExercise(this.progress)
      else {
        this.startOrResumeTimer();
      }
    })
  }
}
