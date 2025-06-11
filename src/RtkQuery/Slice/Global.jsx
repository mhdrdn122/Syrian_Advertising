import Cookies from "universal-cookie";

const cookis = new Cookies(); 

export const prepareHeaders = (headers) => {
    const superAdminInfo = cookis.get("SuperAdminInfo")
  
    if (superAdminInfo && superAdminInfo.token) {
      headers.set("Authorization", `Bearer ${superAdminInfo.token}`);
    }
    headers.set("Accept", "application/json");
    return headers;
  };