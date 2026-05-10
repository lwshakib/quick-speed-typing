/**
 * Better-Auth server-side configuration.
 * This file defines the core authentication engine, integrating database persistence,
 * social OAuth providers, and email-based workflows (verification & password resets).
 */
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import prisma from './prisma';
import { Resend } from 'resend';
import { AuthEmailTemplate } from '@/components/emails/auth-email-template';

// Initialize Resend client for transactional email delivery
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy');

/**
 * Main Auth Configuration:
 * Exports the 'auth' object which is used by both the Next.js route handler and server actions.
 */
export const auth = betterAuth({
  // DATABASE ADAPTER:
  // Uses Prisma to bridge Better-Auth with PostgreSQL.
  // This automatically manages Users, Sessions, Accounts, and Verification Tokens in the DB.
  database: prismaAdapter(prisma, {
    provider: 'postgresql', // Aligns with the datasource provider in schema.prisma
  }),

  // EMAIL & PASSWORD STRATEGY:
  // Configures local credential-based authentication.
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true, // Forces users to click a link in their inbox before they can sign in.

    /**
     * sendResetPassword:
     * Triggered when a user requests a password recovery link.
     * Generates a secure token and sends it via a React-based email template.
     */
    sendResetPassword: async ({ user, token }) => {
      const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;
      try {
        const { error } = await resend.emails.send({
          from: 'Quick Type <noreply@lwshakib.site>', // Sender identity (must be verified in Resend dashboard)
          to: user.email,
          subject: 'Reset your password',
          react: AuthEmailTemplate({ type: 'forgot-password', url: resetUrl }),
        });

        if (error) {
          console.error('Failed to send reset email:', error);
          throw new Error('Failed to send authentication email.');
        }
      } catch (err) {
        console.error('Critical Resend failure:', err);
        throw err;
      }
    },
  },

  // OAUTH SOCIAL PROVIDERS:
  // Enables one-click registration and login via external platforms.
  socialProviders: {
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  // EMAIL VERIFICATION WORKFLOW:
  // Manages the "Check your email" loop after account registration.
  emailVerification: {
    sendOnSignUp: true, // Automatically triggers the verification mail as soon as a user signs up.
    sendVerificationEmail: async ({ user, url }) => {
      try {
        await resend.emails.send({
          from: 'Quick Type <noreply@lwshakib.site>',
          to: user.email,
          subject: 'Verify your email address',
          react: AuthEmailTemplate({ type: 'email-verification', url }),
        });
      } catch (err) {
        console.error('Verification email dispatch failed:', err);
      }
    },
  },

  // SCHEMA EXTENSIONS:
  // Allows us to store application-specific data directly on the User object in the DB.
  user: {
    additionalFields: {
      theme: {
        type: 'string',
        required: false,
        defaultValue: 'serika-dark', // Default aesthetic for new users
      },
    },
  },

  // ADVANCED AUTH LOGIC:
  account: {
    /**
     * accountLinking:
     * Essential feature that allows a user to link multiple social accounts (e.g. Google AND GitHub)
     * to the same email-based identity without creating duplicate profiles.
     */
    accountLinking: {
      enabled: true,
    },
  },
});
