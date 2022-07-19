import {Component, Input, OnInit} from '@angular/core';
import {Highlight} from "../Highlight";
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  @Input() highlight: Highlight;
  url: SafeResourceUrl;
  constructor(public domSanitizer: DomSanitizer) {
    this.highlight  = new Highlight('', '','', '')
    this.url = this.highlight.url;
  }

  ngOnInit(): void {
    this.url = this.highlight.url;
    this.url  = this.domSanitizer.bypassSecurityTrustResourceUrl(this.highlight.url);
  }

}
