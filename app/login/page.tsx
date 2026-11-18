import { ConsumerAuthPage } from "@/components/auth/consumer-auth-page";

export const metadata = {
  title: "Sign in | Wayly",
  description: "Sign in to Wayly to save NYC itineraries and exploration preferences.",
};

export default function LoginPage() {
  return <ConsumerAuthPage mode="login" />;
}
