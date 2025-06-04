"use client";

import React, { useEffect, useMemo, useState } from "react";
import SidebarItem from "./SidebarItem";
import { useSession } from "next-auth/react";
import { IoCallSharp, IoPeopleSharp } from "react-icons/io5";
import { useQuery } from "@apollo/client";
import { FaFlipboard } from "react-icons/fa";
import { MdApproval } from "react-icons/md";
import useLocalStorage from "@/utils/useLocalStorage";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { ImProfile } from "react-icons/im";
import { GoOrganization } from "react-icons/go";
import { SiWebmoney } from "react-icons/si";
import { GET_USERS } from "@/utils/Queries";
import { TbWorldUpload } from "react-icons/tb";

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
  const userName = session?.user?.name;

  const { data: allUsers, loading } = useQuery(GET_USERS);

  const role = session?.user?.role;

  const admins = useMemo(() => {
    return allUsers?.users?.filter((val: any) => val.role === "user") || [];
  }, [allUsers]);

  const sortedCompanies = admins.sort((a: any, b: any) =>
    a?.name.localeCompare(b?.name, undefined, {
      sensitivity: "base",
    })
  );

  useEffect(() => {
    if (search.trim()) {
      const results = sortedCompanies.filter((val: any) =>
        val?.company_name?.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredData(results);
    } else {
      setFilteredData(sortedCompanies);
    }
  }, [search, sortedCompanies]);

  const menuGroups = [
    {
      name: "webibee Info",
      menuItems: [
        session?.user?.role === "user" && {
          icon: (
            <div className="p-1 rounded-md bg-black">
              <TbWorldUpload className="text-4xl sm:text-5xl text-white" />
            </div>
          ),
          label: "Tool",
          route: "/dashboard/tool",
        },
        session?.user?.role === "user" && {
          icon: (
            <div className="p-1 rounded-md bg-black">
              <SiWebmoney className="text-4xl sm:text-5xl text-white" />
            </div>
          ),
          label: "Pricing",
          route: "/dashboard/pricing",
        },
        session?.user?.role === "user" && {
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
      <aside
        className={`absolute z-[1001] top-0 left-0 lg:static lg:flex h-screen w-72.5 flex-col overflow-y-hidden bg-white shadow-2xl duration-300 ease-linear lg:translate-x-0 gap-4 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-6 right-3 z-50 lg:hidden p-1 cursor-pointer rounded-full border border-stroke bg-white shadow-sm"
        >
          <IoIosArrowDropleftCircle className="text-black text-3xl lg:hidden" />
        </button>
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="flex flex-col gap-8 px-6 pt-5.5 pb-3.5 lg:pb-4.5 lg:pt-6.5">
          <>
            <div className="space-y-1 text-black relative">
              <h2 className="text-2xl capitalize font-semibold tracking-wider">{`Hi, ${userName || "Welcome"}`}</h2>
              <p className="absolute -bottom-7 left-0 text-sm md:text-base tracking-wide capitalize font-medium transition-all duration-700 ease-in">
                {session?.user?.email || ""}
              </p>
            </div>
            {role === "admin" && (
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Search customer"
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border border-stroke rounded-lg py-2 pl-3 pr-7 text-[#0E132A] text-sm outline-none focus:border-primary focus-visible:shadow-none placeholder:text-sm"
                  />

                  <span className="absolute right-2 top-2">
                    <svg
                      // className="fill-current"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.5">
                        <path
                          d="M11 6C13.7614 6 16 8.23858 16 11M16.6588 16.6549L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                          stroke="#394b7a"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    </svg>
                  </span>
                </div>
              </div>
            )}
          </>
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex flex-col overflow-y-auto sidebar_scroll duration-300 ease-linear h-full max-h-[75vh]">
          {/* <!-- Sidebar Menu --> */}
          {role === "admin" ? (
            <>
              {loading ? (
                <div className="flex justify-center items-center gap-2.5 h-full w-full px-4 py-2 font-medium text-black duration-300 ease-in-out text-xl capitalize line-clamp-2">
                  Loading...
                </div>
              ) : (
                <nav className="px-4 py-4 lg:px-6">
                  <>
                    {filteredData?.length === 0 && (
                      <p className="text-base md:text-lg font-semibold opacity-80">
                        No User Details...
                      </p>
                    )}
                  </>
                  {filteredData?.map((group: any, groupIndex: number) => (
                    <div key={groupIndex}>
                      <ul className="mb-6 flex flex-col gap-1.5">
                        <SidebarItem
                          key={groupIndex}
                          item={""}
                          pageName={pageName}
                          setPageName={setPageName}
                          companyName={group?.name}
                        />
                      </ul>
                    </div>
                  ))}
                </nav>
              )}
            </>
          ) : (
            <nav className="px-4 py-4 lg:px-6">
              {menuGroups.map((group, groupIndex) => (
                <div key={groupIndex}>
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
          )}
          {/* <!-- Sidebar Menu --> */}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
