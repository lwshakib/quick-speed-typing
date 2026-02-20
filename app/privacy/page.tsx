'use client';

import { PolicyLayout, PolicySection } from "../terms/page";
import { Lock } from "lucide-react";

export default function PrivacyPage() {
  return (
    <PolicyLayout title="privacy policy" icon={<Lock size={32} />}>
        <PolicySection title="1. data collection">
            <p>we believe in privacy. we do not collect any personal data by default. your typing statistics and history are saved only if you create an account and explicitly save them.</p>
        </PolicySection>

        <PolicySection title="2. local storage">
            <p>we use local storage to save your theme preferences and sound settings. this data stays on your machine and is never sent to our servers.</p>
        </PolicySection>

        <PolicySection title="3. third party services">
            <p>we use minimal third-party services. if you choose to sign in with google, we receive your name and email address to create your account.</p>
        </PolicySection>

        <PolicySection title="4. cookies">
            <p>we use only essential cookies for authentication if you are signed in. no tracking or advertising cookies are used on quick type.</p>
        </PolicySection>
    </PolicyLayout>
  );
}
