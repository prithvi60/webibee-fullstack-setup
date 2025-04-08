import Link from "next/link";
import { CredentialsSignIn } from "./CredentialsSignIn";
import { GithubSignIn } from "../layout/github-sign-in";
import { signIn } from "@/utils/auth";

const SignInForm = async () => {
  return (
    <div className="w-full max-w-sm mx-auto space-y-6 border-2 p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>

      <GithubSignIn />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div>

      {/* Email/Password Sign In */}
      {/* <form
        className="space-y-4"
        // action={credentialsAction}
        action={async (formData: FormData) => {
          "use server"
          const data = Object.fromEntries(formData.entries());
          await signIn("credentials", data)
        }}
      >
        <input
          name="email"
          placeholder="Email"
          type="email"
          required
          autoComplete="email"
          className="bg-info/25 text-base md:text-lg font-SourceCodePro focus:ring-1 px-5 py-3 placeholder:text-[#757272] focus:outline-info/80"
        />
        <input
          name="password"
          placeholder="Password"
          id="credentials-password"
          type="password"
          required
          autoComplete="current-password"
          className="bg-info/25 text-base md:text-lg font-SourceCodePro focus:ring-1 px-5 py-3 placeholder:text-[#757272] focus:outline-info/80"
        />
        <button type="submit" className="rounded-lg border-2 border-solid border-white bg-black px-2 py-2 md:py-3 md:px-4 font-semibold capitalize text-white text-sm transition-all duration-300 hover:scale-110">
          Sign In
        </button>
      </form> */}

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

// const [email, setEmail] = useState('');
// const [password, setPassword] = useState('');
// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault(); // Prevents default form submission
//   await signIn("credentials", {
//     email,
//     password,
//     redirect: true,  // Ensures redirection works properly
//     callbackUrl: "/" // Redirect after successful login
//   });
// };
// const credentialsAction = (formData: FormData) => {
//   const data = Object.fromEntries(formData.entries());
//   signIn("credentials", data)
// }
