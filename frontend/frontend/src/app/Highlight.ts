import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import Axios from "axios";
export class Highlight {
  title = '';
  desc = '';
  url: any;
  id= '';
  like = 0;
  dislike = 0;
  selected_like = false;
  selected_dislike = false;
  youtube_id = '';
  domSanitizer: any;
  constructor(title: string, desc: string, url: any, id: string, yid: string, like: number, dislike: number){
    this.domSanitizer = DomSanitizer;
    this.title = title;
    this.desc = desc;
    this.url = url;
    this.id = id;
    this.youtube_id = yid;
    this.like = like;
    this.dislike = dislike;
    // this.url += '?autoplay=1';

  }

  static async getHighlightFromJSONs() {
    let j = await Axios.get('http://localhost:3000/highlight');
    let HighlightArray = []
    for (const x of j.data) {

      let url = 'https://www.youtube.com/embed/' + x.youtube_id;
      HighlightArray.push(new Highlight(x.title, x.desc, url, x._id, x.youtube_id, x.like, x.dislike));
    }
    console.log(HighlightArray)
    return HighlightArray;
  }

  // getSelectedLike(): boolean {
  //   return this.selected_like;
  // }

  // getSelectedDislike(): boolean {
  //   return this.selected_dislike;
  // }

  // updateLike(int n): void {

  // }
}


