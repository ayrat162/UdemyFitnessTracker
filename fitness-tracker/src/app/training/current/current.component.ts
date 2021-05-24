import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-current',
  templateUrl: './current.component.html',
  styleUrls: ['./current.component.css']
})
export class CurrentComponent implements OnInit {
  progress = 0;

  constructor() { }

  ngOnInit(): void {
    setInterval(() => {
      this.progress = this.progress + 5;
    },
    1000)
  }

}
