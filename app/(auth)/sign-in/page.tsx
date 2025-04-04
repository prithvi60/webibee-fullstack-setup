
import { redirect } from "next/navigation";
import SignInForm from "../../../components/features/SignInForm";
import { auth } from "@/utils/auth";

const Page = async () => {
  const session = await auth()
  if (session) {
    redirect("/")
  }
  return (
    <div className="flex justify-center items-center h-screen">
      <SignInForm />
    </div>
  );
};

export default Page;
