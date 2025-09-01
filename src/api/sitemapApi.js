import fetch from "node-fetch";

export async function GET() {
  try {
    // Fetch properties and jobs from your backend API
    const [propertiesRes, jobsRes] = await Promise.all([
      fetch("https://api.easemyspace.in/api/properties").then(res => res.json()),
      fetch("https://api.easemyspace.in/api/admin/job").then(res => res.json()),
    ]);

    const properties = propertiesRes.data || [];
    const jobs = jobsRes.data || [];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static pages
    const staticPages = [
      "", "about", "contact", "subscription", "cancellation-refund",
      "terms-conditions", "privacy-policy", "view-properties", "careers"
    ];

    staticPages.forEach((page) => {
      xml += `  <url><loc>https://easemyspace.in/${page}</loc></url>\n`;
    });

    // Dynamic property pages
    properties.forEach((p) => {
      xml += `  <url><loc>https://easemyspace.in/properties/${p.id}</loc></url>\n`;
    });

    // Dynamic job pages
    jobs.forEach((j) => {
      xml += `  <url><loc>https://easemyspace.in/jobs/${j.id}</loc></url>\n`;
    });

    xml += `</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: { "Content-Type": "application/xml" },
    });
  } catch (err) {
    console.error(err);
    return new Response("Error generating sitemap", { status: 500 });
  }
}
