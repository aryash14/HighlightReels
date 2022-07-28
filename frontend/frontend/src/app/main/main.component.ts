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
  example_highlight: Highlight;
  public example_highlight_arr: (Highlight | any)[];
  ptr = 0
  @ViewChild(PlayerComponent) child: PlayerComponent | undefined;

  sport_selected_id = new UntypedFormControl('');
  sport_team: any;
  filter_team: any;

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

    this.example_highlight_arr = [
      new Highlight('Al Horford PLAYOFF CAREER HIGH!', 'Celtics beat the Warriors!',
      this.domSanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/bil6CoG7xm0'), '1', 'bil6CoG7xm0'),
      new Highlight('TYREEK HILL LINED UP AGAINST COACH OTB!\n ', 'Video desciption...',
        this.domSanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/Y__9f1gymew'), '1', 'Y__9f1gymew'),
      new Highlight('julian edelman’s Incredible catch against the falcons! \n ', 'Inhuman Reaction!',
        this.domSanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/4SiUNdkIwzQ'), '1', '4SiUNdkIwzQ'),
      new Highlight('3 point contest', 'Klay vs Steph',
      this.domSanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/bDObjh4gALU'), '1', 'bDObjh4gALU'),
      new Highlight('Football highlight', 'College Football Best Plays of Bowl Season | 2021-22',
        this.domSanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/8InenAzyj34'), '1', '8InenAzyj34'),
      //https://www.youtube.com/watch?v=CZFQPupSEnk&t=666s
    ];
    this.example_highlight = this.example_highlight_arr[this.ptr]
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
