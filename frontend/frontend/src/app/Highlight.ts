import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

export class Highlight {
  title = '';
  desc = '';
  url: any;
  id= '';
  like = 0;
  dislike = 0;
  youtube_id = '';
  domSanitizer: any;
  constructor(title: string, desc: string, url: any, id: string, yid: string){
    this.domSanitizer = DomSanitizer;
    this.title = title;
    this.desc = desc;
    this.url = url;
    this.id = id;
    this.youtube_id = yid
    // this.url += '?autoplay=1';

  }
}
