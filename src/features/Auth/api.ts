import { api } from "@api/index";
import { loginFormType } from "./types";

export const login = async (data: loginFormType) => {
  return await api.post("/user/login", data);
};
