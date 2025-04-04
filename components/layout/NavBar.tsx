import React from "react";
import Link from "next/link";
import DesktopMenu from "../UI/DesktopMenu";
import MobMenu from "../UI/MobMenu";
import { navLinks } from "@/utils/Data";
import Image from "next/image";
import { GetStartButton } from "../UI/Button";

const NavBar = () => {
  return (
    <header className="px-5 md:px-10 py-6 md:py-4 text-lg z-50 sticky inset-0 flex items-center backdrop-blur-md bg-white bg-opacity-30">
      <nav className="flex justify-between items-center w-full">
        <div className="md:w-36 w-32 relative h-16">
          <Link href="/" title="logo" >
            <Image
              title={"logo"}
              src={"https://ik.imagekit.io/webibee/Webibee/webibeepurplelogo.png?updatedAt=1735897013322"}
              alt="webibee logo"
              fill
              className="object-contain object-center"
            />
          </Link>
        </div>
        {/* navbar menu lists */}
        <div className="flex items-center gap-0.5 sm:gap-x-3.5 xl:gap-x-5">
          <ul className="gap-x-1 lg:!flex items-center hidden">
            {navLinks.map((menu, idx) => (
              <DesktopMenu key={idx} menu={menu} />
            ))}
          </ul>
          <div className="block lg:hidden">
            <GetStartButton text={"contact us"} href={"/contact"} />
          </div>
          <div className="md:ml-4 flex items-center">
            <div className="lg:!hidden ml-2">
              <MobMenu Menus={navLinks} />
            </div>
          </div>
        </div>
        <div className="hidden lg:!block">
          <GetStartButton text={"contact us"} href={"/contact"} />
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
