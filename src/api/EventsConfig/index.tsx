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

export const getPolaroidConfigEventByEventId = async (
  eventId: string
): Promise<string | null> => {
  const { data, error } = await supabase
    .from("event_configs")
    .select("value")
    .eq("event_id", eventId)
    .eq("config_id", "9857fbfa-8f2b-4486-9a02-aef8d16dd7e9")
    .single();

  if (error) {
    console.error("Erro ao buscar configuração de polaroid do evento:", error);
    return null;
  }

  return data?.value || null;
}

export const updatePolaroidConfigEventByEventId = async (
  eventId: string,
  polaroid: boolean
): Promise<boolean> => {
  const { error } = await supabase
    .from("event_configs")
    .update({ value: polaroid.toString() })
    .eq("event_id", eventId)
    .eq("config_id", "9857fbfa-8f2b-4486-9a02-aef8d16dd7e9");

  if (error) {
    console.error("Erro ao atualizar configuração de polaroid do evento:", error);
    return false;
  }

  return true;
}

export const updateTimeConfigEventByEventId = async (
  eventId: string,
  time: number
): Promise<boolean> => {
  const { error } = await supabase
    .from("event_configs")
    .update({ value: time.toString() })
    .eq("event_id", eventId)
    .eq("config_id", "d7e9cb3f-c588-4367-8001-947d48412382");

  if (error) {
    console.error("Erro ao atualizar configuração de tempo do evento:", error);
    return false;
  }

  return true;
}