export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({
    ok: true,
    providers: {
      givenergy: {
        configured: Boolean(process.env.GIVENERGY_API_KEY),
        mode: process.env.GIVENERGY_API_KEY ? 'credentialed' : 'awaiting_credentials'
      },
      n3rgy: {
        configured: Boolean(process.env.N3RGY_API_KEY),
        mode: process.env.N3RGY_API_KEY ? 'credentialed' : 'awaiting_credentials'
      },
      octopus: { configured: true, mode: 'public_api' },
      pvgis: { configured: true, mode: 'public_api' }
    }
  });
}
