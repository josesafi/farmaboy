import { redirect } from "next/navigation";

export default function OfertasPage() {
  redirect("/productos?cat=ofertas");
}
