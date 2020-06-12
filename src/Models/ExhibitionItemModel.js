export default class ExhibitionItemModel {
    id;
    title;
    short_description;
    description;
    participant;
    start_date;
    end_date;
    video_url;
    poster_url;
    is_live;
    map_id;
    constructor(id, map_id, title, short_description, description, participant, video_url, poster_url, start_date, end_date, isLive) {
        this.id = id;
        this.title = title;
        this.short_description = short_description;
        this.description = description;
        this.participant = participant;
        this.video_url = video_url;
        this.start_date =start_date;
        this.end_date = end_date;
        this.poster_url = poster_url;
        this.is_live = isLive;
        this.map_id = map_id;
    }
}