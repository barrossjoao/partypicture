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

export const updatePhotoVisibility = async (
  photo_id: string,
  visible: boolean
): Promise<boolean> => {
  const { error } = await supabase
    .from("photos")
    .update({ visible })
    .eq("id", photo_id);

  if (error) {
    console.error("Erro ao atualizar visibilidade da foto:", error);
    return false;
  }

  return true;
};

export const deletePhotoById = async (photo_id: string): Promise<boolean> => {
  const { error } = await supabase.from("photos").delete().eq("id", photo_id);
  if (error) {
    console.error("Erro ao excluir foto:", error);
    return false;
  }
  return true;
};