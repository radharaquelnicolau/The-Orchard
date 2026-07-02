import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    const accessToken = session?.accessToken;

    console.log("Calendar API - Session:", JSON.stringify(session, null, 2));
    console.log("Calendar API - AccessToken:", accessToken ? "Present" : "Missing");

    if (!accessToken) {
      return NextResponse.json(
        {
          error: "Not authenticated",
          message: "No Google access token found. Please sign in first.",
          hint: "Visit http://localhost:3000 and click 'Sign In' with Google",
        },
        { status: 401 }
      );
    }

    const now = new Date();
    // Fetch events from past 3 months to next 3 months for testing
    const monthStart = new Date(now.getFullYear(), now.getMonth() - 3, 1).toISOString();
    const monthEnd = new Date(
      now.getFullYear(),
      now.getMonth() + 3,
      0,
      23,
      59,
      59
    ).toISOString();

    // First, fetch the list of calendars
    console.log("Calendar API - Fetching calendar list...");
    const calendarListUrl = new URL("https://www.googleapis.com/calendar/v3/users/me/calendarList");
    const calendarListRes = await fetch(calendarListUrl.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const calendarListData = await calendarListRes.json();
    console.log("Calendar API - Calendars found:", calendarListData.items?.length || 0);

    if (!calendarListRes.ok) {
      return NextResponse.json(
        {
          error: "Failed to fetch calendar list",
          status: calendarListRes.status,
          details: calendarListData,
        },
        { status: calendarListRes.status }
      );
    }

    // Types for calendar and event items (avoid using `any`)
    interface GoogleEvent {
      id?: string;
      summary?: string;
      start?: unknown;
      end?: unknown;
      [key: string]: unknown;
    }

    interface CalendarItem {
      id: string;
      summary?: string;
      description?: string;
      primary?: boolean;
      accessRole?: string;
      [key: string]: unknown;
    }

    // Fetch events from all calendars
    const calendars: CalendarItem[] = calendarListData.items || [];
    const allEvents: GoogleEvent[] = [];

    for (const calendar of calendars) {
      const calendarId = calendar.id;
      console.log(`Calendar API - Fetching events from: ${calendar.summary} (${calendarId})`);

      const eventsUrl = new URL(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`
      );

      eventsUrl.searchParams.set("timeMin", monthStart);
      eventsUrl.searchParams.set("timeMax", monthEnd);
      eventsUrl.searchParams.set("singleEvents", "true");
      eventsUrl.searchParams.set("orderBy", "startTime");

      const eventsRes = await fetch(eventsUrl.toString(), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      });

      const eventsData = await eventsRes.json();

      if (eventsRes.ok && eventsData.items) {
        // Add calendar info to each event
        const eventsWithCalendar = (eventsData.items as GoogleEvent[]).map((event) => ({
          ...event,
          calendarName: calendar.summary,
          calendarId: calendar.id,
        }));
        allEvents.push(...eventsWithCalendar);
        console.log(`Calendar API - ${eventsWithCalendar.length} events from ${calendar.summary}`);
      }
    }

    console.log("Calendar API - Total events from all calendars:", allEvents.length);

    return NextResponse.json({
      calendars: calendars.map((c) => ({
        id: c.id,
        summary: c.summary,
        description: c.description,
        primary: c.primary,
        accessRole: c.accessRole,
      })),
      events: allEvents,
    });
  } catch (error) {
    console.error("Calendar API - Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}