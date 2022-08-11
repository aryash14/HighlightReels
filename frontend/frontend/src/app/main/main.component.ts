//imports
import {Component, OnInit, ViewChild} from '@angular/core';
import {ChangeDetectorRef, OnDestroy} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {filter, map, Observable, startWith,} from "rxjs";
import {UntypedFormControl, ReactiveFormsModule} from "@angular/forms";
import {Highlight} from "../Highlight";
import {H} from "@angular/cdk/keycodes";
import {PlayerComponent} from "../player/player.component";
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import Axios from "axios";
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import axios from "axios";

//associating the html and css with component
// let highlight: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
// MainComponent class
export class MainComponent implements OnInit {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  filteredOptions: Observable<string[]>;
  //declaring variables
  teams: any;
  team_names = [];
  search = new UntypedFormControl('');
  example_highlight: any;
  public example_highlight_arr: (Highlight | any)[];
  public filtered_highlight_arr: (Highlight | any)[];
  ptr = 0;
  @ViewChild(PlayerComponent) child: PlayerComponent | undefined;

  sport_selected_id = new UntypedFormControl('');
  sport_team: any;
  filter_team: any;
  loaded = false;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  selected_teams: string[] = [];

  //constructor for our main component
  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public domSanitizer: DomSanitizer) {
    this.filteredOptions = this.search.valueChanges.pipe(
      startWith(''),
      map((value: string) => this._filter(value || '')),
    );

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.search = new UntypedFormControl('');

    // Call filter on new selected sports
    this.sport_selected_id.valueChanges.subscribe( sport_id => {
      this.get_filtered_teams(sport_id)
      }
    )
    //creating the array of highlights
    this.example_highlight_arr = [];
    this.filtered_highlight_arr = [];
    Highlight.getHighlightFromJSONs()
      .then((res) => {
        this.example_highlight_arr = res;
        for (const x of this.example_highlight_arr) {
          x.url = this.domSanitizer.bypassSecurityTrustResourceUrl(x.url);
        }
        // this.example_highlight = this.example_highlight_arr[this.ptr];
        // this.filtered_highlight_arr = JSON.parse(JSON.stringify(this.example_highlight_arr));
        this.filtered_highlight_arr = this.example_highlight_arr.slice();
        console.log(this.example_highlight_arr)
        console.log(this.filtered_highlight_arr)
        this.example_highlight = this.filtered_highlight_arr[this.ptr];

        // highlight = this.example_highlight;
        this.loaded = true
    });
  }

  // Call filter on new selected teams
  private get_filtered_teams(sport_id: any) {
    this.filerSports(sport_id);
    let team = [];
    this.team_names = []

    for (const x of this.sport_team) {
      for (const item of sport_id) {
        console.log(item);
        if (x._id === item) {
          team = x.team;
          for (const x of team) {
            // @ts-ignore
            this.team_names.push(x.name)
          }
        }
      }
    }

    this.filteredOptions = this.search.valueChanges.pipe(
      startWith(''),
      map((value: string) => this._filter(value || '')),
    );

    this.selected_teams = [];
  }

  //getting the sports team from our database
  private async getSportTeam() {
    return (await Axios.get("https://highlight-reels.herokuapp.com/sportteam")).data;
  }

  async ngOnInit(): Promise<any> {
    this.sport_team = await this.getSportTeam()
    console.log(this.sport_team)
  }

  //filtering team names to lower case
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.team_names.filter((option: string) => option.toLowerCase().includes(filterValue));
  }

  // Navigate to next video in the array
  next_arrow(): void {
    if (this.ptr == this.filtered_highlight_arr.length - 1) {
      return;
    }
    this.ptr++;
    // @ts-ignore
    this.example_highlight = this.filtered_highlight_arr[this.ptr];
    // highlight = this.example_highlight;
    // @ts-ignore
    this.child.ngOnInit();

  }

  // Navigates to previous video in the array
  prev_arrow(): void {
    if (this.ptr == 0) {
      return;
    }
    this.ptr--;
    // @ts-ignore
    this.example_highlight = this.filtered_highlight_arr[this.ptr];
    // highlight = this.example_highlight;
    // @ts-ignore
    this.child.ngOnInit();
  }

  private filerSports(sport_id: any) {
    this.filtered_highlight_arr = this.example_highlight_arr.slice();
    this.ptr = 0;
    this.example_highlight = this.filtered_highlight_arr[this.ptr];
    if (sport_id.length === 0) {
      return;
    }

    for (let i = this.example_highlight_arr.length - 1; i >= 0; i--) {
      let found = false;
      let highlight = this.example_highlight_arr[i];
      // console.log(this.sport_team);
      for (const x of sport_id) {
        console.log(x);
        if (x === highlight.sport)
          // this.filtered_highlight_arr.push(highlight);
          found = true;
      }
      if (!found){
        this.filtered_highlight_arr.splice(i,1);
      }
    }
    this.example_highlight = this.filtered_highlight_arr[this.ptr];
  }

  remove(x: string) {
    const i = this.selected_teams.indexOf(x);
    this.selected_teams.splice(i, 1);
    this.filterHighlight();

  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.selected_teams.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.search.setValue(null);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (this.selected_teams.indexOf(event.option.viewValue) >= 0) {
      this.search.setValue('');
      return;
    }
    this.selected_teams.push(event.option.viewValue);
    // this.fruitInput.nativeElement.value = '';
    this.search.setValue(null);
    this.filterHighlight();
  }


  private filterHighlight(): void {
    axios.post('https://highlight-reels.herokuapp.com/highlight/filter', {
      sports: this.sport_selected_id.value,
      teams: this.selected_teams
    })
      .then(res => {
        this.filtered_highlight_arr = Highlight.getHighlightFromJSONsWithAGivenJSON(res.data);
        for (const x of this.filtered_highlight_arr) {
          x.url = this.domSanitizer.bypassSecurityTrustResourceUrl(x.url);
        }
        this.example_highlight = this.filtered_highlight_arr[this.ptr];

      })
  }


}
