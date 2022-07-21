import {Component, Input, OnInit} from '@angular/core';
import {Highlight} from "../Highlight";

@Component({
  selector: 'app-play-button',
  templateUrl: './play-button.component.html',
  styleUrls: ['./play-button.component.css']
})
export class PlayButtonComponent implements OnInit {

  @Input() highlight: Highlight;

  constructor() {
    this.highlight  = new Highlight('', '','', '', '')
  }
  ngOnInit(): void {
  }

}
