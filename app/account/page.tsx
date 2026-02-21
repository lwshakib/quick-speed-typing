// Import server-side authentication utility
import { auth } from "@/lib/auth";
// Import Next.js headers to provide context for session retrieval
import { headers } from "next/headers";
// Import redirection for unauthenticated navigation control
import { redirect } from "next/navigation";
// Import the AccountView component which handles the actual UI and session management
import { AccountView } from "@/components/account-view";

/**
 * AccountPage: A server-side entry point for the user's account management view.
 * It strictly enforces authentication before rendering the account details.
 */
export default async function AccountPage() {
  // Attempt to retrieve the current session using server-side headers
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Security guard: If no session exists, bounce the user back to the landing page
  if (!session) {
    redirect("/");
  }

  // Render the account management interface
  return <AccountView />;
}
