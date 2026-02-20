import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Link,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface AuthEmailTemplateProps {
  type: "email-verification" | "forgot-password";
  url: string;
}

export const AuthEmailTemplate = ({ type, url }: AuthEmailTemplateProps) => {
  const isVerification = type === "email-verification";
  
  return (
    <Html>
      <Head />
      <Preview>
        {isVerification ? "Verify your email address" : "Reset your password"}
      </Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <Text className="text-black text-[24px] font-bold text-center p-0 my-[30px] mx-0">
                {isVerification ? "Verify your Email" : "Reset Password"}
              </Text>
            </Section>
            
            <Text className="text-black text-[14px] leading-[24px]">
              Hello,
            </Text>
            
            <Text className="text-black text-[14px] leading-[24px]">
              {isVerification
                ? "Welcome to Quick Type! Please verify your email address to get started and track your progress."
                : "We received a request to reset your password. If you didn't make this request, you can safely ignore this email."}
            </Text>

            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={url}
              >
                {isVerification ? "Verify Email Address" : "Reset Password"}
              </Button>
            </Section>

            <Text className="text-black text-[14px] leading-[24px]">
              or copy and paste this URL into your browser:{" "}
              <Link href={url} className="text-blue-600 no-underline">
                {url}
              </Link>
            </Text>

            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            
            <Text className="text-[#666666] text-[12px] leading-[24px]">
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
