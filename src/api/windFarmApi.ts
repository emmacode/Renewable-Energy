import axios from "axios";

const API_BASE_URL = "http://localhost:3001";

export async function fetchWindFarmData(): Promise<any> {
  const response = await axios.get(`${API_BASE_URL}/windFarmData`);
  return response.data;
}
