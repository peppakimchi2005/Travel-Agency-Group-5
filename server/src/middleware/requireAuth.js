import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth.js";

// Blocks the request unless the user is signed in.
// If signed in, attaches the user to req.user so routes know who is buying.
export async function requireAuth(req, res, next) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ error: "You must be signed in." });
    }

    req.user = session.user;
    next();
  } catch (err) {
    console.error("requireAuth error:", err);
    res.status(500).json({ error: "Could not verify login." });
  }
}