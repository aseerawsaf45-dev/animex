import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full space-y-8 p-8 border rounded-xl bg-card text-center shadow-2xl">
        <h2 className="text-3xl font-bold text-red-500">Authentication Error</h2>
        <p className="text-muted-foreground">There was a problem signing you in. Please try again.</p>
        <div className="pt-4">
          <Button asChild>
            <Link href="/login">Return to Login</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
