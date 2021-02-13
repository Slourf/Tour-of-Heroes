import { Component, Inject, Input, OnInit, Optional } from '@angular/core';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.css']
})
export class InputFieldComponent implements OnInit {
  // private name: string, @Optional() private value: string, @Optional() private style, private onChange: any

  @Input() public name: string;
  @Input() public onChange: (value: string) => any;
  @Input() public value: string;

  constructor() { }
  
  handleInputChange() {
    this.onChange(this.value);
  }
  

  ngOnInit(): void {
  }
}
