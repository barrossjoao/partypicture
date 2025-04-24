import { supabase } from "../supabaseClient";

export interface Company {
  id: string;
  name: string;
  created_at: string;
}

export const getCompanies = async (): Promise<Company[]> => {
  const { data, error } = await supabase
    .from("companies")
    .select("id, name, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching companies:", error);
    return [];
  }

  return data || [];
};

export const updateCompany = async (
  id: string,
  name: string
): Promise<void> => {
  const { error } = await supabase
    .from("companies")
    .update({ name })
    .eq("id", id);

  if (error) {
    console.error("Error updating company:", error);
  }
}

export const deleteCompany = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("companies")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting company:", error);
  }
}

