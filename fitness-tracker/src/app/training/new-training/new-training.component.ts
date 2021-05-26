import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { TrainingService } from '../training.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  exercises!: Observable<any>;

  constructor(
    private trainingService: TrainingService,
    private db: AngularFirestore
    ) { }

  ngOnInit(): void {
    this.exercises = this.db.collection('availableExercises').valueChanges();
  }

  onTrainingStart(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise)
  }
}
