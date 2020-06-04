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
          item.fields.videoUrl,
          "20200105",
          "20200110"
        )
    })
    return exhibitionItems;
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
