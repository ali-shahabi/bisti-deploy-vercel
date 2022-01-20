import axios from "axios";
import Cookies from "js-cookie";

const config = {
  axiosHandle: (token?: string) => {
    return axios.create({
      baseURL: "/api/",
      headers: {
        Accept: "application/json",
        ...(Cookies.get("token") && { Authorization: Cookies.get("token") }),
        ...(token && {
          "X-AUTH-TOKEN": token,
        }),
      },
    });
  },
};

export default config;
