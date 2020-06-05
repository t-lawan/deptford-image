
import ExhibitionItemModel from "../Models/ExhibitionItemModel";
import * as contentful from 'contentful'
export default class RequestManager {
  static baseUrl = "contentful.com";

  static async getExhibitionItems() {
    let client = contentful.createClient({
      space: 'nrx29ogwm4cn',
      environment: 'master', // defaults to 'master' if not set
      accessToken: '6bQShSi8yy1EIEFrw5pKhqj44QH_Rcp49R_a0yq1X0A'
    })

    let response = await client.getEntries();
    let exhibitionItems = response.items.map((item) => {
      let poster_image = item.fields.posterImage ? item.fields.posterImage.fields.file.url : null
        return new ExhibitionItemModel(
          item.sys.id,
          item.fields.title,
          item.fields.shortDescription,
          item.fields.description,
          item.fields.vimeoId,
          item.fields.videoUrl,
          poster_image,
          "20200105",
          "20200110"
        )
    })
    return exhibitionItems;
  }
}
