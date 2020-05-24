import axios, { AxiosRequestConfig } from "axios";
import ExhibitionItemModel from "../Models/ExhibitionItemModel";

export default class RequestManager {
  static baseUrl = "contentful.com";

  static async getExhibitionItems() {
    let items = [
      new ExhibitionItemModel(
        1,
        "Title",
        `Portland polaroid duis quinoa, proident food truck skateboard
            pickled pok pok pop-up. Selvage pour-over deep v normcore. Bicycle
            rights direct trade leggings ea mollit. Cardigan leggings PBR&B
            beard, officia skateboard direct trade. Jianbing meh sriracha irure,
            PBR&B iPhone distillery est dolore. Cornhole drinking vinegar jean
            shorts, ex labore messenger bag cronut echo park hella sint fam.`,
        `247839331`,
        "20200105",
        "20200110"
      ),
      new ExhibitionItemModel(
        2,
        "Title Two",
        ``,
        `247839331`,
        "20200105",
        "20200110"
      )
    ];
    return items;
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
