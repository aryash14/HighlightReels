//our imports
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {UntypedFormControl} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {MediaMatcher} from "@angular/cdk/layout";
import {DomSanitizer} from "@angular/platform-browser";
import Axios from "axios";
import {MatSnackBar} from "@angular/material/snack-bar";

//associating upload component with css and html files
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})

// Uploadcomponent Class
export class UploadComponent implements OnInit {
  //variables
  team = new UntypedFormControl('');
  filteredOptions: Observable<string[]>;
  title: any;
  desc: any;
  youtube_url: any;

  teams: any;
  team_names = [];
  search = new UntypedFormControl('');
  sport_selected_id = new UntypedFormControl('');

  sport_team: any;
  filter_team: any;

  //constructor
  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public domSanitizer: DomSanitizer, private _snackBar: MatSnackBar) {
    this.filteredOptions = this.search.valueChanges.pipe(
      startWith(''),
      map((value: string) => this._filter(value || '')),
    );

    this.search = new UntypedFormControl('');
      
    this.sport_selected_id.valueChanges.subscribe( sport_id => {
        this.get_filtered_teams(sport_id)
      }
    )
  }

  async ngOnInit(): Promise<void> {
    this.sport_team = await this.getSportTeam()
    console.log(this.sport_team)

  }

  //converting team names to lower case and filtering them
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.team_names.filter((option: string) => option.toLowerCase().includes(filterValue));
  }

  // Find teams allowed based on selected sport
  private get_filtered_teams(sport_id: any) {

    let team = [];
    this.team_names = []
    for (const x of this.sport_team) {
      if (x._id === sport_id) {
        team = x.team;
      }
    }
    for (const x of team) {
      // @ts-ignore
      this.team_names.push(x.name)
    }

    this.filteredOptions = this.search.valueChanges.pipe(
      startWith(''),
      map((value: string) => this._filter(value || '')),
    );
  }

  //private function to get the teams from the database
  private async getSportTeam() {
    return (await Axios.get("http://localhost:3000/sportteam")).data;
  }

  // Post data to MongoDB database
  upload() {
    Axios.post("http://localhost:3000/highlight/upload", {
      title: this.title,
      desc: this.desc,
      youtube_id: this.youtube_url,
      sport: this.sport_selected_id.value,
      team: this.search.value
    })
      .then((res) => {
        this.openSnackBar(res.data.msg);

        if (res.data.success) {
          this.title = '';
        }
      })
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, '');
  }
}
