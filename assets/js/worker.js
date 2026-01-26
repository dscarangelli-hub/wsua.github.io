export default {
  async fetch(request, env) {
    const DONORBOX_API_KEY = env.DONORBOX_API_KEY;

    const response = await fetch("https://donorbox.org/api/v1/donations", {
      headers: {
        "Authorization": `Bearer ${DONORBOX_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch Donorbox data" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const data = await response.json();

    // Extract relevant info
    let totalRaised = 0;
    let donors = [];

    for (const donation of data.donations) {
      const amount = donation.amount;
      const name = donation.donor?.name || "Anonymous";

      totalRaised += amount;

      // Only show donors who gave $30+
      if (amount >= 30) {
        donors.push({
          name,
          amount
        });
      }
    }

    return new Response(JSON.stringify({
      goal: 100000,
      raised: totalRaised,
      donors
    }), {
      headers: { "Content-Type": "application/json" }
    });
  }
};
