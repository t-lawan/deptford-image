export default class PageModel {
    id;
    title;
    text;
    partners;
    constructor(id, title, text, partners) {
        this.id = id;
        this.title = title;
        this.text = text;
        this.partners = partners;
    }
}