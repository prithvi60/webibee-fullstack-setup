"use client";

import React, { useEffect, useMemo, useState } from "react";
import ClickOutside from "./ClickOutside";
import SidebarItem from "./SidebarItem";
import { useSession } from "next-auth/react";
import { GiCardDraw } from "react-icons/gi";
import { IoCallSharp, IoPeopleSharp } from "react-icons/io5";
import { FaFileInvoice, FaQ } from "react-icons/fa6";
import { SiLibreofficedraw } from "react-icons/si";
// import { GET_EMPLOYEE, GET_USERS } from "@/lib/Queries";
import { useQuery } from "@apollo/client";
import { FaFlipboard } from "react-icons/fa";
import { MdApproval } from "react-icons/md";
import useLocalStorage from "@/utils/useLocalStorage";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { ImProfile } from "react-icons/im";
import { GoOrganization } from "react-icons/go";
// import TwoD from "../../public/logo/2d.svg";
interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "");
  const [search, setSearch] = useState<string>("");
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const { data: session } = useSession();

  const menuGroups = [
    {
      name: "Ensileta Info",
      menuItems: [
        {
          icon: (
            <div className="p-1 rounded-md bg-black">
              <ImProfile className="text-4xl sm:text-5xl text-white" />
            </div>
          ),
          label: "Your Profile",
          route: "/dashboard/profile",
        },
        {
          icon: (
            <div className="p-1 rounded-md bg-black">
              <GoOrganization className="text-4xl sm:text-5xl text-white" />
            </div>
          ),
          label: "Organisation",
          route: "/dashboard/organisation",
        },
        {
          icon: (
            <div className="p-1 rounded-md bg-black">
              <IoCallSharp className="text-4xl sm:text-5xl text-white" />
            </div>
          ),
          label: "Support",
          route: "/dashboard/support",
        },
      ].filter(Boolean),
    },
  ];

  return (
    <>
      {/* <!-- Hamburger Toggle BTN --> */}
      {!sidebarOpen && (
        <div className="z-30 absolute block top-6 left-6 h-10 lg:relative lg:hidden">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className={`block rounded-sm border border-stroke p-1.5 shadow-sm bg-black lg:hidden`}
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="du-block absolute right-0 h-full w-full">
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${!sidebarOpen && "!w-full delay-300"
                    }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${!sidebarOpen && "delay-400 !w-full"
                    }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${!sidebarOpen && "!w-full delay-500"
                    }`}
                ></span>
              </span>
              <span className="absolute right-0 h-full w-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${!sidebarOpen && "!h-0 !delay-[0]"
                    }`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${!sidebarOpen && "!h-0 !delay-200"
                    }`}
                ></span>
              </span>
            </span>
          </button>
        </div>
      )}
      {sidebarOpen && (
        <div
          className="fixed h-full w-full top-0 left-0 z-10 bg-black/30 backdrop-blur-lg lg:hidden transition-all duration-300 ease-linear"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        ></div>
      )}
      <aside
        className={`absolute z-20 top-0 left-0 lg:static lg:flex h-screen w-72.5 flex-col overflow-y-hidden bg-white shadow-2xl duration-300 ease-linear lg:translate-x-0 gap-4 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <button type="button" onClick={() => setSidebarOpen(!sidebarOpen)} className="absolute top-6 right-3 z-50 lg:hidden p-1 cursor-pointer rounded-full border border-stroke bg-white shadow-sm">
          <IoIosArrowDropleftCircle className="text-black text-3xl lg:hidden" />
        </button>
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="flex flex-col gap-8 px-6 pt-5.5 pb-3.5 lg:pb-4.5 lg:pt-6.5">
          <>
            <div className="space-y-1 text-black relative">
              <h2 className="text-2xl capitalize font-semibold tracking-wider">{`Hi, userName`}</h2>
              <p className="absolute -bottom-7 left-0 text-sm md:text-base tracking-wide capitalize font-medium transition-all duration-700 ease-in">
                {"ABC"}
              </p>
            </div>
            {/* )} */}
          </>
          {/* )} */}
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex flex-col overflow-y-auto sidebar_scroll duration-300 ease-linear h-full max-h-[75vh]">
          {/* <!-- Sidebar Menu --> */}
          <nav className="px-4 py-4 lg:px-6">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                {/* <h3 className="mb-4 ml-4 capitalize text-xl font-semibold text-bodydark2">
                    {group.name}
                  </h3> */}

                <ul className="mb-6 flex flex-col gap-1.5">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
                      companyName={""}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          {/* // )} */}
          {/* <!-- Sidebar Menu --> */}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

// john@ensileta.com
// contact@ensileta.com
// design@ensileta.com
