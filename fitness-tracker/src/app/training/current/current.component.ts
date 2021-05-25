import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StopTrainingComponent } from './stop-training.component';

@Component({
  selector: 'app-current',
  templateUrl: './current.component.html',
  styleUrls: ['./current.component.css']
})
export class CurrentComponent implements OnInit {
  @Output() trainingExit = new EventEmitter();
  progress = 0;
  timer: any;


  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    this.startOrResumeTimer();
  }

  startOrResumeTimer() {
    this.timer = setInterval(() => {
      this.progress = this.progress + 20;
      if (this.progress >= 100) {
        clearInterval(this.timer);
      }
    },
      1000)
  }

  onStop(): void {
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(StopTrainingComponent, { data: {
      progress: this.progress
    }});

    dialogRef.afterClosed().subscribe(result => {
      if(result)
        this.trainingExit.emit();
        else {
          this.startOrResumeTimer();
        }
    })
  }
}
