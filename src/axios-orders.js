import axios from "axios";

const instance = axios.create({
  baseURL: "https://react-my-burger-eb048.firebaseio.com/"
});

export default instance;
