import { ProductClassWorkspace } from "@/components/product-class-workspace";
import { requireProductSession } from "@/lib/auth/server";

export default async function ProductClassPage({ params }: { params: Promise<{ classId: string }> }) {
  await requireProductSession();
  const { classId } = await params;
  return <ProductClassWorkspace classId={classId} />;
}
