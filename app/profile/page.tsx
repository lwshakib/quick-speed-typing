import { getTypingHistory, getContributionData } from "@/lib/actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ProfileView } from "@/components/profile-view";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  const [history, contributionData] = await Promise.all([
    getTypingHistory(),
    getContributionData(),
  ]);

  return (
    <ProfileView 
      session={session} 
      history={history} 
      contributionData={contributionData} 
    />
  );
}
