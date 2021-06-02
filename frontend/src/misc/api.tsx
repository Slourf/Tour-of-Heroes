import axios from "axios";
import { url } from "../helpers";

const getToken = () => {
  const list: { [name: string]: string } = {};
  const rc = document.cookie;

  if (rc) {
    rc.split(";").forEach((cookie) => {
      const parts: string[] = cookie.split("=");
      const key = parts.shift();
      if (key) {
        list[key.trim()] = decodeURI(parts.join("="));
      }
    });
  }
  return list["auth_token"];
};

const request = axios.create({
  headers: {
    Authorization: "Bearer " + getToken(),
  },
  withCredentials: true,
  baseURL: url,
});

export const requestGet = (url: string): Promise<any> => {
  return request.get(url);
};

export const requestPost = (url: string, data: any): Promise<any> => {
  return request.post(url, data);
};

export const requestDelete = (url: string): Promise<any> => {
  return request.delete(url);
};
