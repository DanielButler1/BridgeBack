import { ProductWorkspace } from "@/components/product-workspace";
import { requireProductSession } from "@/lib/auth/server";

export default async function ProductPage() { await requireProductSession(); return <ProductWorkspace />; }
