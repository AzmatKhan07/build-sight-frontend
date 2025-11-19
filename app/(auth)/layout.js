export const metadata = {
  title: "Login - BuildSight",
  description: "BuildSight Authentication",
};

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md mx-auto">{children}</div>
    </div>
  );
}
