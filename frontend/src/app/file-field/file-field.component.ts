import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-file-field',
  templateUrl: './file-field.component.html',
  styleUrls: ['./file-field.component.css'],
})
export class FileFieldComponent implements OnInit {
  @Input() public id: string;
  @Input() public name: string;
  @Input() public value: File;
  @Output() public onChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  handleFileChange(files: FileList) {
    if (files.length > 0) {
      this.value = files.item(0);
    }
    this.onChange.emit({ id: this.id, value: this.value, name: this.name });
  }
}
