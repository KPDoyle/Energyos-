export default async function handler(req, res) {
  const apiKey = process.env.GIVENERGY_API_KEY;
  const serial = String(req.query.serial || process.env.GIVENERGY_INVERTER_SERIAL || '');

  if (!apiKey) {
    return res.status(200).json({ ok: false, configured: false, error: 'GIVENERGY_API_KEY is not configured' });
  }
  if (!serial) {
    return res.status(400).json({ ok: false, configured: true, error: 'Inverter serial is required' });
  }

  try {
    const response = await fetch(`https://api.givenergy.cloud/v1/inverter/${encodeURIComponent(serial)}/system-data/latest`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json'
      }
    });
    if (!response.ok) throw new Error('GivEnergy returned ' + response.status);
    const payload = await response.json();
    const data = payload.data || payload;
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({
      ok: true,
      configured: true,
      source: 'GivEnergy',
      serial,
      telemetry: {
        time: data.time ?? null,
        status: data.status ?? null,
        solarPowerW: data.solar?.power ?? null,
        gridPowerW: data.grid?.power ?? null,
        batterySocPct: data.battery?.percent ?? null,
        batteryPowerW: data.battery?.power ?? null,
        inverterTemperatureC: data.inverter?.temperature ?? null,
        loadPowerW: data.consumption ?? null
      }
    });
  } catch (error) {
    res.status(502).json({ ok: false, configured: true, error: error.message });
  }
}
