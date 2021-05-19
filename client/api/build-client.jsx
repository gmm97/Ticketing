import axios from "axios";

export default ({ req }) => {
  if (typeof window === "undefined") {
    // we are on the server
    return axios.create({
      baseURL: "http://www.ticketing-production.xyz/",
      headers: req.headers,
    });
  } else {
    // we are on the browser
    return axios.create({
      baseURL: "/",
    });
  }
};
