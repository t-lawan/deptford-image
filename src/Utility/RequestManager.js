
import ExhibitionItemModel from "../Models/ExhibitionItemModel";
import * as contentful from 'contentful'
import PageModel from "../Models/PageModel";
import moment from 'moment'
export default class RequestManager {
  static space = "nrx29ogwm4cn";
  static environment = 'master'
  static accessToken = '6bQShSi8yy1EIEFrw5pKhqj44QH_Rcp49R_a0yq1X0A'

  static async getExhibitionItems() {
    let client = contentful.createClient({
      space: this.space,
      environment: this.environment, // defaults to 'master' if not set
      accessToken: this.accessToken
    })

    let response = await client.getEntries({
      'content_type': 'exhibitionItem'
    });
    let exhibitionItems = response.items.map((item) => {
      let poster_image = item.fields.posterImage ? item.fields.posterImage.fields.file.url : null
        let isAfterStartDate = moment('2020-07-05T00:00+01:00').isSameOrAfter(moment(item.fields.startDate));
        let isBeforeEndDate = moment('2020-07-05T00:00+01:00').isSameOrBefore(moment(item.fields.endDate));

        console.log('IS BEFORE', isBeforeEndDate)
        console.log('IS AFTER', isAfterStartDate)
        console.log('START DATE', item.fields.startDate)
        return new ExhibitionItemModel(
          item.sys.id,
          item.fields.title,
          item.fields.shortDescription,
          item.fields.description,
          item.fields.participant,
          item.fields.videoUrl,
          poster_image,
          item.fields.startDate,
          item.fields.endDate,
          isAfterStartDate && isBeforeEndDate
        )
    })
    return exhibitionItems;
  }

  static async getPages() {
    let client = contentful.createClient({
      space: this.space,
      environment: this.environment, // defaults to 'master' if not set
      accessToken: this.accessToken
    })

    let response = await client.getEntries({
      'content_type': 'page'
    });
    let pages = response.items.map((item) => {
      return new PageModel(
        item.sys.id,
        item.fields.title,
        item.fields.text
      )
    })
    return pages;
  }
}
