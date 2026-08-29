export default async function handler(req, res) {
  try {
    const lat = Number(req.query.lat ?? 51.75);
    const lon = Number(req.query.lon ?? -1.25);
    const peakpower = Number(req.query.peakpower ?? 8.4);
    const loss = Number(req.query.loss ?? 14);
    const angle = Number(req.query.angle ?? 32);
    const aspect = Number(req.query.aspect ?? 45);

    if (![lat, lon, peakpower, loss, angle, aspect].every(Number.isFinite)) {
      return res.status(400).json({ ok: false, error: 'Invalid numeric input' });
    }

    const url = new URL('https://re.jrc.ec.europa.eu/api/v5_3/PVcalc');
    url.searchParams.set('lat', String(lat));
    url.searchParams.set('lon', String(lon));
    url.searchParams.set('peakpower', String(peakpower));
    url.searchParams.set('loss', String(loss));
    url.searchParams.set('angle', String(angle));
    url.searchParams.set('aspect', String(aspect));
    url.searchParams.set('outputformat', 'json');

    const response = await fetch(url);
    if (!response.ok) throw new Error('PVGIS returned ' + response.status);
    const data = await response.json();
    const totals = data?.outputs?.totals?.fixed || {};
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=86400');
    res.status(200).json({
      ok: true,
      source: 'PVGIS 5.3',
      inputs: { lat, lon, peakpower, loss, angle, aspect },
      yearlyEnergyKwh: totals.E_y ?? null,
      yearlyIrradiation: totals['H(i)_y'] ?? null,
      systemLossPct: totals.l_total ?? null,
      monthly: data?.outputs?.monthly?.fixed || []
    });
  } catch (error) {
    res.status(502).json({ ok: false, error: error.message });
  }
}
