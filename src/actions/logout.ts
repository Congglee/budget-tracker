"use server";

import { signOut } from "@/auth";

export async function logout() {
  // Doing some server-side stuff
  await signOut();
}
