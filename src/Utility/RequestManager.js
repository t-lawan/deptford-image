import axios, { AxiosRequestConfig } from "axios";
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
        return new ExhibitionItemModel(
          item.sys.id,
          item.fields.title,
          item.fields.shortDescription,
          item.fields.description,
          item.fields.vimeoId,
          "20200105",
          "20200110"
        )
    })
    // let items = [
    //   new ExhibitionItemModel(
    //     1,
    //     "Title",
    //     `Portland polaroid duis quinoa, proident food truck skateboard
    //         pickled pok pok pop-up. Selvage pour-over deep v normcore. Bicycle
    //         rights direct trade leggings ea mollit. Cardigan leggings PBR&B
    //         beard, officia skateboard direct trade. Jianbing meh sriracha irure,
    //         PBR&B iPhone distillery est dolore. Cornhole drinking vinegar jean
    //         shorts, ex labore messenger bag cronut echo park hella sint fam.`,
    //     `247839331`,
    //     "20200105",
    //     "20200110"
    //   ),
    //   new ExhibitionItemModel(
    //     2,
    //     "Title Two",
    //     ``,
    //     `247839331`,
    //     "20200105",
    //     "20200110"
    //   )
    // ];
    return exhibitionItems;
    // return await this.get(`${this.baseUrl}/video/create`);
  }

  static get = async url => {
    let config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    return await axios.get(url, config);
  };

  static post = async (url, data) => {
    const d = JSON.stringify(data);
    let config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    return await axios.post(url, d, config);
  };
}
