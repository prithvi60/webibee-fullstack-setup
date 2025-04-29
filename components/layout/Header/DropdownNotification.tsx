import React from "react";
import { signOut } from "next-auth/react";

const DropdownNotification = () => {

  const handleLogout = () => {
    signOut({ redirect: true, callbackUrl: "/api/auth/signin" });
    localStorage.removeItem("selectedMenu");
  }

  return (
    <>
      <button onClick={handleLogout} type="submit" className='ml-2 cursor-pointer px-5 py-2 shadow-md select-none bg-black text-white hover:bg-[#0E122B] hover:text-white'>Sign Out</button>
    </>
  );
};

export default DropdownNotification;
