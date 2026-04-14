// Import server actions for fetching user-specific typing data
import { getContributionData, getProfileStats } from '@/lib/actions';
// Import authentication utilities for server-side session validation
import { auth } from '@/lib/auth';
// Import Next.js headers for session context
import { headers } from 'next/headers';
// Import redirection utility for unauthenticated access control
import { redirect } from 'next/navigation';
// Import the client-side ProfileView component for rendering the stats
import { ProfileView } from '@/components/profile/profile-view';

/**
 * ProfilePage: A server-side component that orchestrates data fetching for the user's profile.
 * It validates the session, retrieves historical performance, and provides data for the activity heatmap.
 */
export default async function ProfilePage() {
  // Retrieve the current user's session from the auth API
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect to home if the user is not authenticated
  if (!session) {
    redirect('/');
  }

  // Fetch all necessary profile data concurrently to optimize page load time
  const [contributionData, profileStats] = await Promise.all([
    getContributionData(), // Aggregated daily activity for the heatmap
    getProfileStats(), // Global personal bests and averages
  ]);

  // Sanity check: Ensure profile stats exist before attempting to render
  if (!profileStats) {
    redirect('/');
  }

  // Pass the fetched data to the client-side ProfileView for rich visualization
  return <ProfileView contributionData={contributionData} profileStats={profileStats} />;
}
