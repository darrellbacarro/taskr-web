'use client';

import { Loader } from "@/lib/components/Loader";
import { useAuth } from "@/lib/hooks/use-auth";
import { redirect } from "next/navigation";

export default function App() {
  const { loading, user } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    redirect("/login");
  }

  redirect('/u');
}