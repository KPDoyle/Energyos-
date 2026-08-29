export default async function handler(req, res) {
  try {
    const response = await fetch('https://api.octopus.energy/v1/products/?brand=OCTOPUS_ENERGY&is_business=false');
    if (!response.ok) throw new Error('Octopus returned ' + response.status);
    const data = await response.json();
    const products = (data.results || [])
      .filter(p => p.available_to == null)
      .slice(0, 8)
      .map(p => ({
        code: p.code,
        displayName: p.display_name,
        fullName: p.full_name,
        variable: p.is_variable,
        green: p.is_green,
        direction: p.direction
      }));
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.status(200).json({ ok: true, count: data.count || products.length, products });
  } catch (error) {
    res.status(502).json({ ok: false, error: error.message });
  }
}
