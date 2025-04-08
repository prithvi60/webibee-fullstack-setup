"use client";
import { signOut } from "next-auth/react";

const SignOut = () => {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="flex justify-center">
      <button className="py-2 px-3 cursor-pointer bg-black text-white rounded text-sm md:text-base" onClick={handleSignOut}>
        Sign Out
      </button>
    </div>
  );
};

export { SignOut };
