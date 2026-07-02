import { NextResponse } from "next/server";

// Calculate which day of the year today is (1–365)
function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export async function GET() {
  const key = process.env.YV_APP_KEY;
  if (!key) return NextResponse.json({ error: "No API key" }, { status: 500 });

  const headers = { "X-YVP-App-Key": key };
  const day = getDayOfYear();

  // Step 1 — get today's verse reference (USFM)
  const votdRes = await fetch(
    `https://api.youversion.com/v1/verse_of_the_days/${day}`,
    { headers, next: { revalidate: 3600 } }
  );

  if (!votdRes.ok) {
    const body = await votdRes.json().catch(() => ({}));
    return NextResponse.json(
      { error: "VOTD fetch failed", status: votdRes.status, body },
      { status: 502 }
    );
  }

  const votdData = await votdRes.json();
  // The reference comes back as a USFM string e.g. "JHN.3.16"
  const usfm = votdData?.passage_id;
  if (!usfm) {
    return NextResponse.json({ error: "No USFM in response", votdData }, { status: 502 });
  }

  // Step 2 — fetch the actual verse text (bible_id 3034 = BSB, used in YouVersion's own docs)
  const passageRes = await fetch(
    `https://api.youversion.com/v1/bibles/3034/passages/${usfm}`,
    { headers, next: { revalidate: 3600 } }
  );

  if (!passageRes.ok) {
    const body = await passageRes.json().catch(() => ({}));
    return NextResponse.json(
      { error: "Passage fetch failed", status: passageRes.status, body },
      { status: 502 }
    );
  }

  const passageData = await passageRes.json();

  // Strip any HTML tags from the text (YouVersion returns HTML in passage content)
  const rawText = passageData?.data?.content ?? passageData?.content ?? "";
  const text = rawText.replace(/<[^>]+>/g, "").trim();
  const reference = passageData?.data?.reference?.human ?? votdData?.verse?.human_reference ?? usfm;

  return NextResponse.json({ text, reference });
}