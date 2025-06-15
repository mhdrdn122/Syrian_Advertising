export const prepareHeaders = (headers) => {
    const superAdminInfo = JSON.parse(localStorage.getItem("SuperAdminInfo"))
  
    if (superAdminInfo && superAdminInfo.token) {
      headers.set("Authorization", `Bearer ${superAdminInfo.token}`);
    }
    headers.set("Accept", "application/json");
    return headers;
  };