import { supabase } from "../supabaseClient";

export interface CreateEvent {
  event_id: string;
  config_id: string;
  value: string;
}

export const createEventConfig = async (
  config: CreateEvent
): Promise<boolean> => {
  const { error } = await supabase.from("event_configs").insert(config);

  if (error) {
    console.error("Erro ao criar configuração do evento:", error);
    return false;
  }

  return true;
};

export const getTimeConfigEventByEventId = async (
  eventId: string
): Promise<string | null> => {
  const { data, error } = await supabase
    .from("event_configs")
    .select("value")
    .eq("event_id", eventId)
    .eq("config_id", "d7e9cb3f-c588-4367-8001-947d48412382")
    .single();

  if (error) {
    console.error("Erro ao buscar configuração de tempo do evento:", error);
    return null;
  }

  return data?.value || null;
}