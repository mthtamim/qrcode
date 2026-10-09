export function generateWifiString(ssid: string, password?: string, hidden = false): string {
  const enc = password ? "WPA" : "nopass";
  return `WIFI:T:${enc};S:${ssid};${password ? `P:${password};` : ""}${hidden ? "H:true;" : ""};`;
}

export function generateVCardString(data: {
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  org?: string;
  title?: string;
}): string {
  const parts = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${data.lastName};${data.firstName};;;`,
    `FN:${data.firstName} ${data.lastName}`,
  ];
  if (data.org) parts.push(`ORG:${data.org}`);
  if (data.title) parts.push(`TITLE:${data.title}`);
  if (data.phone) parts.push(`TEL;TYPE=WORK,VOICE:${data.phone}`);
  if (data.email) parts.push(`EMAIL;TYPE=PREF,INTERNET:${data.email}`);
  parts.push("END:VCARD");
  return parts.join("\n");
}

export function generateEmailString(to: string, subject?: string, body?: string): string {
  let str = `mailto:${to}`;
  const params = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  if (params.length > 0) str += `?${params.join("&")}`;
  return str;
}

export function generateLocationString(lat: number, lng: number): string {
  return `geo:${lat},${lng}`;
}

export function getDynamicFilename(text: string, ext: "png" | "svg" | "pdf"): string {
  if (!text) return `qr-code.${ext}`;
  // take first 20 alphanumeric chars
  const clean = text.replace(/[^a-z0-9]/gi, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 20);
  return clean ? `${clean}-qr.${ext}` : `qr-code.${ext}`;
}
