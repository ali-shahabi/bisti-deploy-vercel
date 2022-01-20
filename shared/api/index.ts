import { Login } from "@/shared/interfaces";
import config from "./config";

const API = {
  login: (body: Login) => {
    return config.axiosHandle().post("v0/adminlogin", body);
  },
  //category
  categoryListApi: () => {
    return config.axiosHandle().get("v0/category/list");
  },
};
export default API;
