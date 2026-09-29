export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    service: "CIFER MD",
    mode: "vercel-api",
    message: "API online. WhatsApp worker must run as a persistent service."
  });
}
