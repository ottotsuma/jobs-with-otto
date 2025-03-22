import { redirect } from "next/navigation";

export default function Home() {
  redirect("/en"); // Change to your default locale
}
