export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="out bg-sfa-tan min-h-screen">{children}</div>;
}
