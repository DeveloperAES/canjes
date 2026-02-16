
import axiosClient from "./axiosRestClient";


// export async function postUserApi(payload) {
//   const { data } = await axiosClient.post("/user", payload);
//   return data;
// }


export async function getUserDetailsApi() {
  const { data } = await axiosClient.get("/user/form_detail");
  return data;
}

export async function updateProfileApi(payload) {
  const { data } = await axiosClient.put("/user", payload);
  return data;
}






export async function getUserExchanges() {
  const { data } = await axiosClient.get("/exchange/user");
  return data;
}


//Points
export async function getUserPointsApi() {
  const { data } = await axiosClient.get("/user/points");
  return data;
}

export async function getUserDetailedPointsApi() {
  const { data } = await axiosClient.get("/user/detailed_points");
  return data;
}
//Cart


export async function postUserCartApi(payload) {
  const { data } = await axiosClient.post("/cart", payload);
  return data;
}

export async function getUserCartApi() {
  const { data } = await axiosClient.get("/cart/user");
  return data;
}

export async function clearCartApi() {
  const { data } = await axiosClient.delete("/cart/clear");
  return data;
}

//Exchange
export async function postExchangeApi(payload) {
  const { data } = await axiosClient.post("/exchange", payload);
  return data;
}