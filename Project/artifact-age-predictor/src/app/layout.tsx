import "../styles/globals.css";
import SupabaseProvider from "../components/SupabaseProvider";
import ClientLayout from "../components/ClientLayout";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const metadata = {
  title: "Artifact Age Predictor",
  description: "Predict the age of historical artifacts using AI",
  icon:"/favicon.ico",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <SupabaseProvider session={session}>
          <div className="page-wrapper">
            <ClientLayout>{children}</ClientLayout>
          </div>
        </SupabaseProvider>
      </body>
    </html>
  );
}
