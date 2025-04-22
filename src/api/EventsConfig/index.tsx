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