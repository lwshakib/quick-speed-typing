'use client';

import { PolicyLayout, PolicySection } from "../terms/page";
import { Shield } from "lucide-react";

export default function SecurityPage() {
  return (
    <PolicyLayout title="security" icon={<Shield size={32} />}>
        <PolicySection title="1. data protection">
            <p>all user data is encrypted at rest and in transit. we utilize industry-standard security practices to ensure your information remains safe.</p>
        </PolicySection>

        <PolicySection title="2. authentication">
            <p>we use secure authentication providers to handle login and session management. we never store your passwords directly on our servers.</p>
        </PolicySection>

        <PolicySection title="3. incident response">
            <p>in the unlikely event of a security breach, we have procedures in place to mitigate the impact and notify affected users promptly.</p>
        </PolicySection>

        <PolicySection title="4. reporting vulnerabilities">
            <p>if you find any security vulnerabilities in quick type, please report them to contact@quicktype.io. we appreciate your help in making quick type more secure.</p>
        </PolicySection>
    </PolicyLayout>
  );
}
