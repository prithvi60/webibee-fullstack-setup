import { auth } from "@/utils/auth";
export default async function Home() {
  const session = await auth();
  console.log(session);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-10 text-xl md:text-5xl sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h4>Home</h4>
      {session && (<p className="text-gray-600">{session.user?.email || ""}</p>)}
    </div>
  );
}
