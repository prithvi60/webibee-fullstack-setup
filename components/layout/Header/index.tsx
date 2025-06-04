import DropdownNotification from "./DropdownNotification";
import { useSession } from "next-auth/react";

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const { data: session } = useSession();
  // const { name } = useParams();

  // const role = session?.user?.role;
  return (
    <header className="sticky top-0 z-[1000] flex w-full drop-shadow-xl bg-white">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center w-max xl:w-[85%] overflow-hidden gap-3 md:gap-5 ">
          {/* <!-- Hamburger Toggle BTN --> */}
          <div className="z-30 absolute block top-6 left-6 h-10 lg:relative lg:hidden">
            <button
              aria-controls="sidebar"
              onClick={(e) => {
                e.stopPropagation();
                props.setSidebarOpen(!props.sidebarOpen);
              }}
              className={`block rounded-sm border border-stroke p-1.5 shadow-sm bg-black lg:hidden`}
            >
              <span className="relative block h-5.5 w-5.5 cursor-pointer">
                <span className="du-block absolute right-0 h-full w-full">
                  <span
                    className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && "!w-full delay-300"
                      }`}
                  ></span>
                  <span
                    className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && "delay-400 !w-full"
                      }`}
                  ></span>
                  <span
                    className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && "!w-full delay-500"
                      }`}
                  ></span>
                </span>
                <span className="absolute right-0 h-full w-full rotate-45">
                  <span
                    className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && "!h-0 !delay-[0]"
                      }`}
                  ></span>
                  <span
                    className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && "!h-0 !delay-200"
                      }`}
                  ></span>
                </span>
              </span>
            </button>
          </div>
          {/* <!-- Hamburger Toggle BTN --> */}
          {/* </div> */}
          {/* <div > */}
          {/* ADd dmh logo */}
          {/* <div className="w-64 h-10 relative hidden sm:block">
            <Image alt="logo" src={"/logo/newlogo.png"} fill />
          </div> */}
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          {/* <!-- Notification Menu Area --> */}
          <DropdownNotification />
          {/* <!-- Notification Menu Area --> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
