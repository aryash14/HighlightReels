import {Component, OnInit, ViewChild} from '@angular/core';
import {ChangeDetectorRef, OnDestroy} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {map, Observable, startWith,} from "rxjs";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {Highlight} from "../Highlight";
import {H} from "@angular/cdk/keycodes";
import { PlayerComponent} from "../player/player.component";

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
  search = new FormControl('');
  example_highlight: Highlight;
  public example_highlight_arr: (Highlight | any)[];
  ptr = 0
  @ViewChild(PlayerComponent) child: PlayerComponent | undefined;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.search = new FormControl('');

    this.filteredOptions = this.search.valueChanges.pipe(
      startWith(''),
      map((value: string) => this._filter(value || '')),
    );

    this.example_highlight_arr = [new Highlight('Al Horford PLAYOFF CAREER HIGH!', 'Video desciption...', 'https://www.youtube.com/watch?v=bil6CoG7xm0', '1'),
    new Highlight('julian edelman’s Incredible catch against the falcons! ', 'Video desciption...', 'https://www.youtube.com/watch?v=4SiUNdkIwzQ', '1'),
      new Highlight('Ja\'Marr Chase completes a 3rd & 27! ', 'Video desciption...', 'https://www.youtube.com/watch?v=nYvbptky-Uk', '1'),
    ]
    this.example_highlight = this.example_highlight_arr[this.ptr]
  }

  ngOnInit(): void {
    this.teams = ['team a', 'team b', 'team c']
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.teams.filter((option: string) => option.toLowerCase().includes(filterValue));
  }

  next_arrow(): void {
    console.log("u")

    this.ptr++;
    // @ts-ignore
    this.example_highlight = this.example_highlight_arr[this.ptr];
    // @ts-ignore
    this.child.ngOnInit();

  }

  prev_arrow(): void {
    this.ptr++;
  }
}
