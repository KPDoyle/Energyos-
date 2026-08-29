export default function handler(req, res) {
  const siteId = String(req.query.id || 'willow-house');
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({
    ok: true,
    site: {
      id: siteId,
      name: siteId === 'willow-house' ? 'Willow House' : siteId,
      modelVersion: 'energyos-site-v1',
      location: { country: 'GB', timezone: 'Europe/London' },
      assets: [
        { id: 'pv-1', type: 'solar_array', manufacturer: 'demo', capacityKw: 8.4 },
        { id: 'inv-1', type: 'inverter', manufacturer: 'demo', status: 'online' },
        { id: 'bat-1', type: 'battery', manufacturer: 'demo', capacityKwh: 10.4, stateOfChargePct: 72 }
      ],
      telemetry: {
        solarPowerKw: 3.8,
        loadPowerKw: 1.6,
        batteryPowerKw: 1.4,
        gridPowerKw: 0.8,
        source: 'demo_until_oem_connected'
      }
    }
  });
}
