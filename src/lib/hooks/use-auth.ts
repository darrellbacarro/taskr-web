import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth
      .getUser()
      .then(({ data }) => setUser(data.user))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
};
