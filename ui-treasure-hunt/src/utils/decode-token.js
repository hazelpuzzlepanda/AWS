import { jwtDecode } from "jwt-decode";

export const decodeToken = () => {
const token = localStorage.getItem("accessToken");
if (token) {
  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error("Invalid token", error);
    return '';
  }
}
}
