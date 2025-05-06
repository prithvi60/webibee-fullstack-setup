import Link from "next/link";
import { CredentialsSignIn } from "./CredentialsSignIn";

const SignInForm = async () => {
  return (
    <div className="relative w-full max-w-sm mx-auto space-y-6 border-2 p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>

      {/* <GithubSignIn />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div> */}

      <CredentialsSignIn />
      <div className="text-center text-blue-800 text-base md:text-lg">
        <button
          type="button"
          className="hover:underline hover:underline-offset-8"
        >
          <Link href="/sign-up">Don&apos;t have an account? Sign up</Link>
        </button>
      </div>
    </div>
  );
};

export default SignInForm;

