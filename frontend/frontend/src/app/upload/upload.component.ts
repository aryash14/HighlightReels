import {Component, OnInit} from '@angular/core';
import {UntypedFormControl} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {


  team = new UntypedFormControl('');
  filteredOptions: Observable<string[]>;
  teams = ['team a', 'team b', 'team c']
  constructor() {
    this.filteredOptions = this.team.valueChanges.pipe(
      startWith(''),
      map((value: string) => this._filter(value || '')),
    );
  }

  ngOnInit(): void {

  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.teams.filter((option: string) => option.toLowerCase().includes(filterValue));
  }
}
