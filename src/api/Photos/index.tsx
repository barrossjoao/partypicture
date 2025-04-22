import { supabase } from "../supabaseClient";

export interface Photo {
  id: string;
  image_url: string;
  event_id: string;
}

export const getPhotosByEventId = async (event_id: string): Promise<Photo[]> => {
  const { data, error } = await supabase
    .from("photos")
    .select("id, image_url, event_id")
    .eq("event_id", event_id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching photos:", error);
    return [];
  }

  return data || [];
}