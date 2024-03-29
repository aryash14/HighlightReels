import {Component, Input, OnInit} from '@angular/core';
import {Highlight} from "../Highlight";
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import Axios from 'axios';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})

// PlayerComponent class
export class PlayerComponent implements OnInit {
  @Input() highlight: Highlight = new  Highlight('', '', '', '', '', 0, 0,'','');
  url: SafeResourceUrl | undefined;
  constructor(public domSanitizer: DomSanitizer) {

  }

  ngOnInit(): void {
    // @ts-ignore

  }

  async like() {
    let curr_highlight = this.highlight;
    if (curr_highlight.selected_like) {
      curr_highlight.like -= 1;
      curr_highlight.selected_like = false;
    }
    else if (curr_highlight.selected_dislike) {
      curr_highlight.dislike -= 1;
      curr_highlight.selected_dislike = false;
      curr_highlight.like += 1;
      curr_highlight.selected_like = true;
    }
    else {
      curr_highlight.like += 1;
      curr_highlight.selected_like = true;
    }
    console.log("like counter update");
    await Axios.post("http://localhost:3000/highlight/likedislike", {
      id: curr_highlight.id,
      like: curr_highlight.like,
      dislike : curr_highlight.dislike
    })
  }
  
  async dislike() {
    let curr_highlight = this.highlight;
    if (curr_highlight.selected_dislike) {
      curr_highlight.dislike -= 1;
      curr_highlight.selected_dislike = false;
    }
    else if (curr_highlight.selected_like) {
      curr_highlight.dislike += 1;
      curr_highlight.selected_dislike = true;
      curr_highlight.like -= 1;
      curr_highlight.selected_like = false;
    }
    else {
      curr_highlight.dislike += 1;
      curr_highlight.selected_dislike = true;
    }
    console.log("dislike counter update");
    await Axios.post("http://localhost:3000/highlight/likedislike", {
      id: curr_highlight.id,
      like: curr_highlight.like,
      dislike : curr_highlight.dislike
    })
  }

}
