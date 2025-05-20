
(function () {
  const SITE_ID = document.currentScript.getAttribute("data-site-id");
  const SUPABASE_URL = "https://aandwoaqwhkgggudkfdm.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhbmR3b2Fxd2hrZ2dndWRrZmRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2ODgxMTYsImV4cCI6MjA2MzI2NDExNn0.f7iJj6eti1J7pjB1XPVuVxmoKW8En6inb4YQumgOM3M";

  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  function sendEvent(eventType, elementText, url) {
    const visitorId = getVisitorId();

    // Use fetch with POST and wait slightly if redirect is coming
    fetch(\`\${SUPABASE_URL}/rest/v1/events\`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": "Bearer " + SUPABASE_ANON_KEY,
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({
        site_id: SITE_ID,
        event_type: eventType,
        element_text: elementText,
        url,
        visitor_id: visitorId,
      })
    });
  }

  function getVisitorId() {
    let id = localStorage.getItem("touchmapper_visitor_id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("touchmapper_visitor_id", id);
    }
    return id;
  }

  // Pageview
  window.addEventListener("load", () => {
    sendEvent("pageview", "Page Loaded", window.location.href);
  });

  // Click tracking with redirect delay
  document.addEventListener("click", (e) => {
    const el = e.target.closest("a, button");
    if (!el) return;

    const text = el.innerText || el.getAttribute("href") || "unknown";

    // Intercept <a> clicks with redirect delay
    if (el.tagName.toLowerCase() === "a" && el.href) {
      e.preventDefault();
      sendEvent("click", text, window.location.href);
      setTimeout(() => {
        window.location.href = el.href;
      }, 200); // 200ms delay to allow fetch
      return;
    }

    // For buttons
    if (el.tagName.toLowerCase() === "button") {
      sendEvent("click", text, window.location.href);
    }
  });
})();
