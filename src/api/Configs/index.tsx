import { supabase } from "../supabaseClient";

export interface Configs {
  id: string;
  name: string;
  description: string;
}

export const getConfigs = async (): Promise<Configs[]> => {
  const { data, error } = await supabase
    .from("configs")
    .select("id, name, description")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching configs:", error);
    return [];
  }

  return data || [];
}

