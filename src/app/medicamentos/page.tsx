import { redirect } from "next/navigation";

export default async function MedicamentosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const query = new URLSearchParams();
  if (params?.q) query.set("q", params.q);
  if (params?.cat) query.set("cat", params.cat);
  const qs = query.toString();
  redirect(`/productos${qs ? `?${qs}` : ""}`);
}
