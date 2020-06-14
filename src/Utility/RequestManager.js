import ExhibitionItemModel from "../Models/ExhibitionItemModel";
import * as contentful from "contentful";
import PageModel from "../Models/PageModel";
import moment from "moment";
import MediaAssetModel from "../Models/MediaAssetModel";
export default class RequestManager {
  static space = "nrx29ogwm4cn";
  static environment = "master";
  static accessToken = "6bQShSi8yy1EIEFrw5pKhqj44QH_Rcp49R_a0yq1X0A";

  static async getExhibitionItems() {
    let client = contentful.createClient({
      space: this.space,
      environment: this.environment, // defaults to 'master' if not set
      accessToken: this.accessToken
    });

    let response = await client.getEntries({
      content_type: "exhibitionItem"
    });

    let exhibitionItems = response.items.map(item => {
      let poster_image = item.fields.posterImage
        ? item.fields.posterImage.fields.file.url
        : null;
      let isAfterStartDate = moment().isSameOrAfter(
        moment(item.fields.startDate)
      );
      let isBeforeEndDate = moment().isSameOrBefore(
        moment(item.fields.endDate)
      );

      let pdf = item.fields.pdf ? item.fields.pdf.fields : null;

      let audintSection = item.fields.audintSection
        ? item.fields.audintSection.map(section => {
            return section.fields;
          })
        : null;

      return new ExhibitionItemModel(
        item.sys.id,
        item.fields.mapId,
        item.fields.title,
        item.fields.type,
        item.fields.shortDescription,
        item.fields.description,
        item.fields.participant,
        item.fields.videoUrl,
        poster_image,
        item.fields.startDate,
        item.fields.endDate,
        isAfterStartDate && isBeforeEndDate,
        audintSection,
        pdf
      );
    });
    return exhibitionItems;
  }

  static async getPages() {
    let client = contentful.createClient({
      space: this.space,
      environment: this.environment, // defaults to 'master' if not set
      accessToken: this.accessToken
    });

    let response = await client.getEntries({
      content_type: "page",
      include: 3

    });
    let pages = response.items.map(item => {
      let partners = item.fields.partners
        ? item.fields.partners.map(partner => {
            let images = partner.fields.partnerImage
              ? partner.fields.partnerImage.map(image => {
                  return {
                    image: image.fields.image.fields
                  }
                })
              : null;
            return {
              title: partner.fields.title,
              images: images
            };
          })
        : null;

        let team_members =  item.fields.teamMembers ? item.fields.teamMembers.map((tm) => {
          return tm.fields
        }) : null
      return new PageModel(
        item.sys.id,
        item.fields.title,
        item.fields.text,
        partners,
        team_members
      );
    });

    return pages;
  }

  static async getAssets() {
    let client = contentful.createClient({
      space: this.space,
      environment: this.environment, // defaults to 'master' if not set
      accessToken: this.accessToken
    });

    let response = await client.getAssets();
    let mediaAssets = response.items.map((asset) => {
      return new MediaAssetModel(asset.sys.id,asset.fields.title, asset.fields.file.url, asset.fields.file.contentType);
    });
    return mediaAssets;
  }
}
