"use client";

import { signOut } from "next-auth/react";

interface LogoutButtonProps {
  children?: React.ReactNode;
}

export default function LogoutButton({ children }: LogoutButtonProps) {
  const handleSignOut = () => {
    signOut();
  };

  return (
    <button onClick={handleSignOut} className="text-left w-full">
      {children}
    </button>
  );
}
