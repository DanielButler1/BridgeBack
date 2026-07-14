import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { hasClerk } from "@/lib/config";

const authenticatedProxy = clerkMiddleware();

export default hasClerk
  ? authenticatedProxy
  : function localDemoProxy() {
      return NextResponse.next();
    };

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api)(.*)",
  ],
};
