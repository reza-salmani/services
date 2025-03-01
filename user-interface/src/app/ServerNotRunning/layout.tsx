export default function ServerNotRunningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-[100vh] w-[100vw] flex ">{children}</div>;
}
