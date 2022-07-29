import {Component, OnInit, ViewChild} from '@angular/core';
import {ChangeDetectorRef, OnDestroy} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {map, Observable, startWith,} from "rxjs";
import {UntypedFormControl, ReactiveFormsModule} from "@angular/forms";
import {Highlight} from "../Highlight";
import {H} from "@angular/cdk/keycodes";
import {PlayerComponent} from "../player/player.component";
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import Axios from "axios";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  filteredOptions: Observable<string[]>;

  teams: any;
  team_names = [];
  search = new UntypedFormControl('');
  example_highlight: any;
  public example_highlight_arr: (Highlight | any)[];
  ptr = 0
  @ViewChild(PlayerComponent) child: PlayerComponent | undefined;

  sport_selected_id = new UntypedFormControl('');
  sport_team: any;
  filter_team: any;
  loaded = false;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public domSanitizer: DomSanitizer) {
    this.filteredOptions = this.search.valueChanges.pipe(
      startWith(''),
      map((value: string) => this._filter(value || '')),
    );

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.search = new UntypedFormControl('');


    this.sport_selected_id.valueChanges.subscribe( sport_id => {
        this.get_filtered_teams(sport_id)
      }
    )
    this.example_highlight_arr = []
    Highlight.getHighlightFromJSONs()
      .then((res) => {
        this.example_highlight_arr = res;
        for (const x of this.example_highlight_arr) {
          x.url = this.domSanitizer.bypassSecurityTrustResourceUrl(x.url);
        }
        this.example_highlight = this.example_highlight_arr[this.ptr];
        this.loaded = true
    });


  }

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

  private async getSportTeam() {
    return (await Axios.get("http://localhost:3000/sportteam")).data;
  }

  async ngOnInit(): Promise<any> {
    this.sport_team = await this.getSportTeam()
    console.log(this.sport_team)
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.team_names.filter((option: string) => option.toLowerCase().includes(filterValue));
  }

  next_arrow(): void {
    if (this.ptr == this.example_highlight_arr.length - 1) {
      return;
    }
    this.ptr++;
    // @ts-ignore
    this.example_highlight = this.example_highlight_arr[this.ptr];
    // @ts-ignore
    this.child.ngOnInit();

  }

  prev_arrow(): void {
    if (this.ptr == 0) {
      return;
    }
    this.ptr--;
    // @ts-ignore
    this.example_highlight = this.example_highlight_arr[this.ptr];
    // @ts-ignore
    this.child.ngOnInit();
  }

}
