// Simple dashboard that reads summary data from Apps Script

document.addEventListener("DOMContentLoaded", async () => {
  async function loadJSON(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(path + " failed to load");
    return res.json();
  }

  const tableBody = document.querySelector("#dashboard-table tbody");

  try {
    const settings = await loadJSON("data/settings.json");
    if (!settings.dashboardEndpoint) {
      tableBody.innerHTML = "<tr><td colspan='4'>No dashboard endpoint configured.</td></tr>";
      return;
    }

    const res = await fetch(settings.dashboardEndpoint);
    const data = await res.json();

    if (!data || data.status !== "ok" || !data.summary) {
      tableBody.innerHTML = "<tr><td colspan='4'>No summary data available yet.</td></tr>";
      return;
    }

    const entries = Object.entries(data.summary);
    if (!entries.length) {
      tableBody.innerHTML = "<tr><td colspan='4'>No events recorded yet.</td></tr>";
      return;
    }

    tableBody.innerHTML = "";
    for (const [videoId, stats] of entries) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="padding:0.25rem 0.25rem;">${videoId}</td>
        <td style="padding:0.25rem 0.25rem; text-align:right;">${stats.plays}</td>
        <td style="padding:0.25rem 0.25rem; text-align:right;">${stats.completes}</td>
        <td style="padding:0.25rem 0.25rem; text-align:right;">${stats.other}</td>
      `;
      tableBody.appendChild(tr);
    }
  } catch (err) {
    console.error("Dashboard failed", err);
    tableBody.innerHTML = "<tr><td colspan='4'>Unable to load dashboard data.</td></tr>";
  }
});
