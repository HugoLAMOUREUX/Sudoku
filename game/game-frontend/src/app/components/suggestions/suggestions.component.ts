import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.css'],
})
export class SuggestionsComponent implements OnInit {
  @Input() suggestion: string;
  constructor() {
    this.suggestion = '';
  }

  ngOnInit(): void {}
}
