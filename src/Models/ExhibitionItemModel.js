export default class ExhibitionItemModel {
    id;
    title;
    short_description;
    description;
    vimeo_id;
    start_date;
    end_date;
    video_url;
    poster_url;
    constructor(id, title, short_description, description, vimeo_id, video_url, poster_url, start_date, end_date) {
        this.id = id;
        this.title = title;
        this.short_description = short_description;
        this.description = description;
        this.vimeo_id = vimeo_id;
        this.video_url = video_url;
        this.video_url = video_url;
        this.start_date =start_date;
        this.end_date = end_date;
        this.poster_url = poster_url;
    }
}