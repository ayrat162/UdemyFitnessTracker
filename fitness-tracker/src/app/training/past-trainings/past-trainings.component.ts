import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import * as fromTraining from '../training.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css']
})
export class PastTrainingsComponent implements OnInit, AfterViewInit {
  displayedColumns = ['date', 'name', 'duration', 'calories', 'state'];
  dataSource = new MatTableDataSource<Exercise>();

  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(
    private trainingService: TrainingService,
    private store: Store<fromTraining.State>
  ) { }

  ngOnInit(): void {
    this.store.select(fromTraining.getFinishedExercises).subscribe(exercises =>
      this.dataSource.data = exercises)
    this.trainingService.fetchCompletedOrCancelledExercises();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort!;
    this.dataSource.paginator = this.paginator!;
  }

  doFilter(event: Event) {
    let filterValue = (<HTMLInputElement>event.target).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
