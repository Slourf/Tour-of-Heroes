import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-file-field',
  templateUrl: './file-field.component.html',
  styleUrls: ['./file-field.component.css']
})
export class FileFieldComponent implements OnInit {

  fileToUpload: File = null;

  @Input() name: string;
  @Input() public onChange: (value: File) => any;

  constructor() { }

  ngOnInit(): void {
  }

  handleFileInput(files: FileList) {
    if (files.length > 0) {
      this.fileToUpload = files.item(0);
    }
  }
}
