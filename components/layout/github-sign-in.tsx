import { Google } from "@/components/ui/github";
import { signIn } from "@/lib/auth";

const GithubSignIn = () => {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { callbackUrl: "/" });
      }}
    >
      <button className="w-full text-base md:text-lg px-5 py-2.5 bg-blue-800 flex justify-center text-white hover:bg-opacity-80 rounded-md items-center gap-4" type="submit">
        <Google />
        Continue with Google
      </button>
    </form>
  );
};

export { GithubSignIn };
