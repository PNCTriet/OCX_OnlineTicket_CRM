import { Geist, Geist_Mono } from "next/font/google";
import "../app/globals.css";
//import "../../public/css/style.css";
import { AuthProvider } from "@/hooks/useAuth";

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
  title: "OCX Admin",
  description: "Nền tảng quản trị bán vé đa tổ chức, bảo mật, realtime, do Howls Studio phát triển.",
  applicationName: "OCX Admin",
  authors: [{ name: "Howls Studio", url: "https://howls.studio" }],
  icons: {
    icon: "/client_logo_ss3.jpg",
  },
  openGraph: {
    title: "OCX Admin - Howls Studio",
    description: "Nền tảng quản trị bán vé đa tổ chức, bảo mật, realtime, do Howls Studio phát triển.",
    url: "https://admin.otcayxe.com/",
    siteName: "Howls Studio",
    images: [
      {
        url: "https://admin.otcayxe.com/client_logo_ss3.jpg",
        width: 800,
        height: 800,
        alt: "OCX Admin Logo",
      },
    ],
    type: "website",
    locale: "vi_VN",
  },
  other: {
    provider: "Howls Studio",
    brand: "Howls Studio",
    logo: "https://admin.otcayxe.com/sponsor_logo_1.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark bg-gray-900">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
