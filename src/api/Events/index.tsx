import { supabase } from "../supabaseClient";

export interface Events {
  id: string;
  name: string;
  slug: string;
  upload_url: string;
  created_at: string;
  company_id: string;
  event_date?: string;
  custom_description?: string;
}

export interface CreateEvent {
  name: string;
  slug: string;
  upload_url: string;
  company_id: string;
  event_date?: string;
  custom_description?: string;
}

export const getEvents = async (): Promise<Events[]> => {
  const { data, error } = await supabase
    .from("events")
    .select("id, name, slug, upload_url, created_at, company_id, event_date")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching events:", error);
    return [];
  }

  return data || [];
};

export const getEventsByCompanyId = async (
  companyId: string
): Promise<Events[]> => {
  const { data, error } = await supabase
    .from("events")
    .select(
      "id, name, slug, upload_url, created_at, company_id, event_date, custom_description"
    )
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching events by company ID:", error);
    return [];
  }

  return data || [];
};

export const getEventById = async (id: string): Promise<Events | null> => {
  const { data, error } = await supabase
    .from("events")
    .select(
      "id, name, slug, upload_url, created_at, company_id, event_date, custom_description"
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching event by ID:", error);
    return null;
  }

  return data;
};

export const createEvent = async (
  event: CreateEvent
): Promise<Events | null> => {
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

export const generateUniqueSlug = async (name: string): Promise<string> => {
  const base = name.toLowerCase().replace(/\s+/g, "-");
  let attempt = base;
  const original = base;

  while (true) {
    const { data, error } = await supabase
      .from("events")
      .select("id")
      .eq("slug", attempt)
      .maybeSingle();

    if (!data || error) break;

    attempt = `${original}-${Math.floor(Math.random() * 10000)}`;
  }

  return attempt;
};

export const getEventBySlug = async (slug: string): Promise<Events | null> => {
  const { data, error } = await supabase
    .from("events")
    .select(
      "id, name, slug, upload_url, created_at, company_id, event_date, custom_description"
    )
    .eq("slug", slug)
    .single();

  if (error || !data) {
    console.error("Erro ao buscar evento por slug:", error);
    return null;
  }

  return data;
};

export const updateEvent = async (
  id: string,
  event: Partial<CreateEvent>
): Promise<Events | null> => {
  const { data, error } = await supabase
    .from("events")
    .update(event)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating event:", error);
    return null;
  }

  return data;
};
