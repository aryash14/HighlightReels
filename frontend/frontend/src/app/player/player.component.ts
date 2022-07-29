import {Component, Input, OnInit} from '@angular/core';
import {Highlight} from "../Highlight";
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})

// PlayerComponent class
export class PlayerComponent implements OnInit {
  @Input() highlight: Highlight = new  Highlight('', '', '', '', '');
  url: SafeResourceUrl | undefined;
  constructor(public domSanitizer: DomSanitizer) {

  }

  ngOnInit(): void {
    // @ts-ignore

  }

}
