export default class PageModel {
    id;
    title;
    text;
    partners;
    team_members
    constructor(id, title, text, partners, teamMembers) {
        this.id = id;
        this.title = title;
        this.text = text;
        this.partners = partners;
        this.team_members = teamMembers;
    }
}