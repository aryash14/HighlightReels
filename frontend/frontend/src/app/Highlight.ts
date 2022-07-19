export class Highlight {
  title = '';
  desc = '';
  url= '';
  id= '';
  like = 0;
  dislike = 0;
  youtube_id = '';
  constructor(title: string, desc: string, url: string, id: string){
    this.title = title;
    this.desc = desc;
    this.url = url;
    this.id = id;
    this.youtube_id = url.split('=')[1];
    this.url = this.url.replace('watch?v=', 'embed/');
    // this.url += '?autoplay=1';
    console.log(this.url);
  }
}
