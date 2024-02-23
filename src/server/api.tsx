import axios from "axios";

const baseUrl = "https://viacep.com.br/ws/";

const api = axios.create({ baseURL: baseUrl });

export const getCep = async (cep: string) => {
  try {
    const response = await api.get(`${cep}/json/`);
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error("Error fetching cep", error);
  }
};
