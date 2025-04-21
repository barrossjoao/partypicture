import { supabase } from "../supabaseClient";

export interface Events {
  id: string;
  name: string;
  slug: string;
  upload_url: string;
  created_at: string;
  company_id: string;
}

export const getEvents = async (): Promise<Events[]> => {
  const { data, error } = await supabase
    .from("events")
    .select("id, name, slug, upload_url, created_at, company_id")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching events:", error);
    return [];
  }

  return data || [];
};

export const getEventsByCompanyId = async (companyId: string): Promise<Events[]> => {
  const { data, error } = await supabase
    .from("events")
    .select("id, name, slug, upload_url, created_at, company_id")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching events by company ID:", error);
    return [];
  }

  return data || [];
}

export const createEvent = async (event: Events): Promise<Events | null> => {
  const { data, error } = await supabase
    .from("events")
    .insert(event)
    .select()
    .single();

  if (error) {
    console.error("Error creating event:", error);
    return null;
  }

  return data;
};

