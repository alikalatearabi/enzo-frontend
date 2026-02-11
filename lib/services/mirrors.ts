import { Mirror } from "../api/mirrors";
import apiClient from "../api/client";

export async function getMirrors(): Promise<Mirror[]> {
  return apiClient.get<Mirror[]>("/mirrors");
}

