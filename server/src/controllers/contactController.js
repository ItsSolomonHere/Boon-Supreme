export async function postContact(req, res) {
  const { name, email, message } = req.body || {};
  console.log("[contact stub]", { name, email, message: message?.slice?.(0, 200) });
  res.status(202).json({ ok: true, message: "Thanks — we'll get back to you soon." });
}
