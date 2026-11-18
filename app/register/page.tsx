import { ConsumerAuthPage } from "@/components/auth/consumer-auth-page";

export const metadata = {
  title: "Create account | Wayly",
  description: "Create a Wayly account to save NYC itineraries and exploration preferences.",
};

export default function RegisterPage() {
  return <ConsumerAuthPage mode="register" />;
}
