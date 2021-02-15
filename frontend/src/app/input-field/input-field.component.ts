import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.css'],
})
export class InputFieldComponent implements OnInit {
  @Input() public id: string;
  @Input() public name: string;
  @Input() public value: string;
  @Output() public onChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  handleInputChange() {
    console.log(this.id, this.name, this.value);
    if (this.onChange) {
      console.log(this.id);
      this.onChange.emit({ id: this.id, value: this.value, name: this.name });
    }
  }
}
