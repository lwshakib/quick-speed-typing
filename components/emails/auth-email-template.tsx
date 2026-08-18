import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Link,
  Tailwind,
} from '@react-email/components';
import * as React from 'react';

interface AuthEmailTemplateProps {
  type: 'email-verification' | 'forgot-password';
  url: string;
}

export const AuthEmailTemplate = ({ type, url }: AuthEmailTemplateProps) => {
  const isVerification = type === 'email-verification';

  return (
    <Html>
      <Head />
      <Preview>{isVerification ? 'Verify your email address' : 'Reset your password'}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Text className="mx-0 my-[30px] p-0 text-center text-[24px] font-bold text-black">
                {isVerification ? 'Verify your Email' : 'Reset Password'}
              </Text>
            </Section>

            <Text className="text-[14px] leading-[24px] text-black">Hello,</Text>

            <Text className="text-[14px] leading-[24px] text-black">
              {isVerification
                ? 'Welcome to Quick Type! Please verify your email address to get started and track your progress.'
                : "We received a request to reset your password. If you didn't make this request, you can safely ignore this email."}
            </Text>

            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={url}
              >
                {isVerification ? 'Verify Email Address' : 'Reset Password'}
              </Button>
            </Section>

            <Text className="text-[14px] leading-[24px] text-black">
              or copy and paste this URL into your browser:{' '}
              <Link href={url} className="text-blue-600 no-underline">
                {url}
              </Link>
            </Text>

            <Text className="text-[12px] leading-[20px] text-[#666666]">
              This link will expire in 1 hour. If you did not request this, please ignore this email.
            </Text>

            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

            <Text className="text-[12px] leading-[24px] text-[#666666]">
              Quick Type Team <br />
              <Link href="https://lwshakib.site" className="text-[#666666] no-underline">
                lwshakib.site
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default AuthEmailTemplate;
