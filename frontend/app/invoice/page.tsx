import { redirect } from "next/navigation";

export default function StaticInvoiceRedirect() {
  redirect("/orders");
}
