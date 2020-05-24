export default class ExhibitionItemModel {
    id;
    title;
    short_description;
    description;
    vimeo_id;
    start_date;
    end_date;

    constructor(id, title, description, vimeo_id, start_date, end_date) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.vimeo_id = vimeo_id;
        this.start_date =start_date;
        this.end_date = end_date;
    }
}