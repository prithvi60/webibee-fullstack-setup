
import { redirect } from "next/navigation";
import SignInForm from "../../../components/features/SignInForm";
import { auth } from "@/utils/auth";
import Link from "next/link";
import { FaHome } from "react-icons/fa";

const Page = async () => {
  const session = await auth()
  if (session) {
    redirect("/")
  }
  return (
    <div className="flex justify-center items-center h-screen">
      <Link href={"/"} className="p-1.5 bg-black absolute top-6 right-6 md:right-16 rounded-full cursor-pointer hover:bg-black/70 transition-all duration-300 ease-in-out">
        <FaHome className="text-xl md:text-2xl text-white" />
      </Link>
      <SignInForm />
    </div>
  );
};

export default Page;
