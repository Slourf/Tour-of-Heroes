import axios from "axios";
import { url } from "../helpers";

const request = axios.create({
  withCredentials: false,
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
