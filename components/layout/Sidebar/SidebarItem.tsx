"use client"
import React, { useEffect, useState } from "react";
import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";
import SidebarDropdown from "./SidebarDropdown";
import { SiVorondesign } from "react-icons/si";

const SidebarItem = ({ item, pageName, setPageName, companyName }: any) => {
  // const [hrefValue, setHrefValue] = useState("");
  const router = useRouter();
  const handleClick = () => {
    const updatedPageName =
      pageName !== item.label.toLowerCase() ? item.label.toLowerCase() : "";
    return setPageName(updatedPageName);
  };

  const handleClickForEmployee = () => {

    const updatedPageName =
      pageName !== companyName ? companyName : "";
    setPageName(updatedPageName);
    // router.push(`/portal/dashboard/${updatedPageName.replace(/\s/g, "_")}`);
    router.push(`/dashboard/${encodeURIComponent(updatedPageName)}`);
  }

  const pathname = usePathname();

  const isActive = (item: any) => {
    if (item.route === pathname) return true;
    if (item.children) {
      return item.children.some((child: any) => isActive(child));
    }
    return false;
  };

  const isItemActive = isActive(item);

  return (
    <>
      {item === "" ? (
        <li className={` ${pageName === companyName ? "bg-black text-white " : ""} flex items-center gap-2.5  hover:bg-black/50 cursor-pointer`}>
          <div className="p-1 rounded-md bg-secondary">
            <SiVorondesign className="text-4xl sm:text-5xl text-black" />
          </div>
          <div
            // href={hrefValue}
            onClick={handleClickForEmployee}
            className={` relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out text-base capitalize line-clamp-2`}
          >
            {companyName}
          </div>
        </li>
      ) : (
        <li>
          <Link
            href={item.route}
            onClick={handleClick}
            className={`${isItemActive ? "bg-black/30" : ""} group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-semibold text-bodydark1 duration-300 ease-in-out text-xs hover:bg-black/30 capitalize`}
          >
            {item.icon}
            {item.label}
            {item.children && (
              <svg
                className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${pageName === item.label.toLowerCase() && "rotate-180"
                  }`}
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                  fill=""
                />
              </svg>
            )}
          </Link>

          {item.children && (
            <div
              className={`translate transform overflow-hidden ${pageName !== item.label.toLowerCase() && "hidden"
                }`}
            >
              <SidebarDropdown item={item.children} />
            </div>
          )}
        </li>)}


    </>
  );
};

export default SidebarItem;
