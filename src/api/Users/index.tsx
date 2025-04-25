import { supabase } from "../supabaseClient";

export interface Users {
  id: string;
  name: string;
  email: string;
  role: string;
  company_id: string;
}

export const getUsers = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("*")

    console.log(data,'data')

  if (error) {
    throw new Error(error.message);
  }

  return data as Users[];
};


export const getUserById = async (id: string): Promise<Users | null> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching user by ID:", error);
    return null;
  }

  return data as Users;
}

export const updateUser = async (
  id: string,
  name: string,
  email: string,
  company_id: string
): Promise<void> => {
  const { error } = await supabase
    .from("users")
    .update({ name, email, company_id })
    .eq("id", id);

  if (error) {
    console.error("Error updating user:", error);
  }
}

export const updateUserProfile = async (
  id: string,
  name: string,
  email: string
): Promise<void> => {
  const { error } = await supabase
    .from("users")
    .update({ name, email })
    .eq("id", id);

  if (error) {
    console.error("Error updating user:", error);
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("users")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting user:", error);
  }
}

export const changeUserPassword = async (newPassword: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};


