import { Geist, Geist_Mono } from "next/font/google";
import "../app/globals.css";
//import "../../public/css/style.css";
import { AuthProvider } from "@/hooks/useAuth";
import Head from 'next/head';

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata = {
  title: "OCX Online Ticket CRM",
  description: "CRM Admin for Online Ticketing",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>OCX Admin</title>
        <meta name="application-name" content="OCX Admin" />
        <meta name="description" content="Nền tảng quản trị bán vé đa tổ chức, bảo mật, realtime, do Howls Studio phát triển." />
        <link rel="icon" href="/client_logo_ss3.jpg" />
        <meta property="og:image" content="/client_logo_ss3.jpg" />
        <meta name="author" content="Howls Studio" />
        <meta name="provider" content="Howls Studio" />
        <meta property="og:site_name" content="Howls Studio" />
        <meta property="og:brand" content="Howls Studio" />
        <meta property="og:logo" content="/sponsor_logo_1.png" />
        <meta property="og:title" content="OCX Admin - Howls Studio" />
        <meta property="og:description" content="Nền tảng quản trị bán vé đa tổ chức, bảo mật, realtime, do Howls Studio phát triển." />
      </Head>
      <html lang="en" className="dark bg-gray-900">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <AuthProvider>{children}</AuthProvider>
        </body>
      </html>
    </>
  );
}
