"use client";

import React, { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/lib/stores/auth-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setRoles, setLoading, clear } = useAuthStore();

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    async function getSession() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Fetch profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profile) {
          setUser(profile);

          // Fetch roles
          const { data: roles } = await supabase
            .from("user_roles")
            .select("*")
            .eq("user_id", user.id)
            .eq("status", "active");

          setRoles(roles || []);
        }
      }
      setLoading(false);
    }

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (profile) {
            setUser(profile);
            const { data: roles } = await supabase
              .from("user_roles")
              .select("*")
              .eq("user_id", session.user.id)
              .eq("status", "active");
            setRoles(roles || []);
          }
        } else if (event === "SIGNED_OUT") {
          clear();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [setUser, setRoles, setLoading, clear]);

  return <>{children}</>;
}
