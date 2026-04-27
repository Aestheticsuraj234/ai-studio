import { getAuthToken, getCurrentUser } from "@/lib/auth";
import { listVideoRecords, StrapiError } from "@/lib/strapi";

export const runtime = "nodejs";

export async function GET() {
  const jwt = await getAuthToken();
  const user = jwt ? await getCurrentUser() : null;

  if (!jwt || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const videos = await listVideoRecords(jwt);
    return Response.json({ videos });
  } catch (error) {
    const status = error instanceof StrapiError ? error.status : 500;
    const message =
      error instanceof Error ? error.message : "Failed to load videos.";
    return Response.json({ error: message }, { status });
  }
}
