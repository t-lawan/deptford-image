import moment from 'moment'
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
    audint_section;
    type;
    displayed_time;
    pdf;
    constructor(id, map_id, title, type, short_description, description, participant, video_url, poster_url, start_date, end_date, isLive, audintSection, pdf) {
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
        this.audint_section = audintSection;
        this.type = type;
        this.pdf = pdf;
        if(moment(this.start_date).month() === moment(this.end_date).month()) {
            this.displayed_time = `${moment(this.start_date).format('D')} - ${moment(this.end_date).format('D MMMM')}`
        } else {
            this.displayed_time = `${moment(this.start_date).format('D MMMM')} - ${moment(this.end_date).format('D MMMM')}`

        }
    }
}