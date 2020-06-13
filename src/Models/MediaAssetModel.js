export default class MediaAssetModel {
    id;
    title;
    url;
    type;
    constructor(id, title, url, type) {
        this.id = id;
        this.title = title;
        this.url = url;
        this.type = type;
    }
}