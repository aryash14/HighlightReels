import {Component, OnInit, ViewChild} from '@angular/core';
import {ChangeDetectorRef, OnDestroy} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {map, Observable, startWith,} from "rxjs";
import {UntypedFormControl, ReactiveFormsModule} from "@angular/forms";
import {Highlight} from "../Highlight";
import {H} from "@angular/cdk/keycodes";
import { PlayerComponent} from "../player/player.component";
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

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
  search = new UntypedFormControl('');
  example_highlight: Highlight;
  public example_highlight_arr: (Highlight | any)[];
  ptr = 0
  @ViewChild(PlayerComponent) child: PlayerComponent | undefined;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public domSanitizer: DomSanitizer) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.search = new UntypedFormControl('');

    this.filteredOptions = this.search.valueChanges.pipe(
      startWith(''),
      map((value: string) => this._filter(value || '')),
    );

    this.example_highlight_arr = [
      new Highlight('Al Horford PLAYOFF CAREER HIGH!', 'Video desciption...',
      this.domSanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/bil6CoG7xm0'), '1', 'bil6CoG7xm0'),

      new Highlight('TYREEK HILL LINED UP AGAINST COACH OTB!\n ', 'Video desciption...',
        this.domSanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/Y__9f1gymew'), '1', 'Y__9f1gymew'),
      new Highlight('julian edelman’s Incredible catch against the falcons! \n ', 'Video desciption...',
        this.domSanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/4SiUNdkIwzQ'), '1', '4SiUNdkIwzQ')
    ];
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
    this.child.ngOnInit();  }
}
