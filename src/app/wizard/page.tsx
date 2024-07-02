import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function Wizard() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect("/api/auth/login");
  }

  return (
    <div className="container max-w-2xl flex flex-col justify-between gap-4">
      <h1 className="text-center text-3xl space-x-2">
        Welcome,{" "}
        <span className="font-bold">
          {user.given_name} {user.family_name} 👋🥳
        </span>
      </h1>
      <p className="mt-4 text-center text-muted-foreground leading-8">
        Let&apos;s get started by setting up your currency.
        <br />
        <span className="text-sm">
          You can change these settings at any time
        </span>{" "}
      </p>
    </div>
  );
}
