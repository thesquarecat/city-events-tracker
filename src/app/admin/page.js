import { pool } from "../../lib/db";
import { revalidatePath } from "next/cache";

async function addEvent(formData) {
  "use server";

  const title = formData.get("title");
  const description = formData.get("description");
  const areaId = Number(formData.get("area_id"));
  const venueIdRaw = formData.get("venue_id");
  const venueId = venueIdRaw ? Number(venueIdRaw) : null;

  await pool.query(
    `
    INSERT INTO Event (
      title, description, start_datetime, end_datetime, status, created_by, area_id, venue_id
    )
    VALUES (
      $1, $2, NOW(), NOW() + INTERVAL '1 day', 'scheduled', 1, $3, $4
    );
    `,
    [title, description, areaId, venueId]
  );

  revalidatePath("/");
  revalidatePath("/feed");
  revalidatePath("/admin");
}

async function updateEventStatus(formData) {
  "use server";

  const eventId = Number(formData.get("event_id"));
  const status = formData.get("status");

  await pool.query(
    `
    UPDATE Event
    SET status = $1
    WHERE event_id = $2;
    `,
    [status, eventId]
  );

  revalidatePath("/");
  revalidatePath("/feed");
  revalidatePath("/admin");
}

async function deleteEvent(formData) {
  "use server";

  const eventId = Number(formData.get("event_id"));

  await pool.query(`DELETE FROM EventCategory WHERE event_id = $1;`, [eventId]);
  await pool.query(`DELETE FROM Event WHERE event_id = $1;`, [eventId]);

  revalidatePath("/");
  revalidatePath("/feed");
  revalidatePath("/admin");
}

export default async function AdminPage() {
  const eventsResult = await pool.query(`
    SELECT e.event_id, e.title, e.status, a.area_name
    FROM Event e
    JOIN Area a ON e.area_id = a.area_id
    ORDER BY e.event_id;
  `);

  const areasResult = await pool.query(`
    SELECT area_id, area_name
    FROM Area
    ORDER BY area_id;
  `);

  const venuesResult = await pool.query(`
    SELECT venue_id, venue_name
    FROM Venue
    ORDER BY venue_id;
  `);

  const events = eventsResult.rows;
  const areas = areasResult.rows;
  const venues = venuesResult.rows;

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 mb-4">
          Manage city events stored in PostgreSQL.
        </p>

        <nav className="flex gap-4 mb-8">
          <a className="text-blue-600 hover:underline font-medium" href="/">
            Events
          </a>
          <a className="text-blue-600 hover:underline font-medium" href="/feed">
            Personalized Feed
          </a>
          <a className="text-gray-900 hover:underline font-medium" href="/admin">
            Admin
          </a>
        </nav>

        <section className="bg-white rounded-xl shadow p-5 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Current Events</h2>

          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.event_id}
                className="border border-gray-200 rounded-lg p-3"
              >
                <p className="font-semibold">
                  #{event.event_id} — {event.title}
                </p>
                <p className="text-sm text-gray-600">
                  Area: {event.area_name} | Status: {event.status}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-xl shadow p-5 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Add Event</h2>
          <p className="text-sm text-gray-500 mt-2">
          Added events will appear above after refresh.
          </p>

          <form action={addEvent} className="space-y-3">
            <input
              className="w-full border border-gray-300 rounded-lg p-2"
              name="title"
              placeholder="Event title"
              required
            />

            <textarea
              className="w-full border border-gray-300 rounded-lg p-2"
              name="description"
              placeholder="Event description"
              required
            />

            <select
              className="w-full border border-gray-300 rounded-lg p-2"
              name="area_id"
              required
            >
              {areas.map((area) => (
                <option key={area.area_id} value={area.area_id}>
                  {area.area_name}
                </option>
              ))}
            </select>

            <select
              className="w-full border border-gray-300 rounded-lg p-2"
              name="venue_id"
            >
              <option value="">No specific venue</option>
              {venues.map((venue) => (
                <option key={venue.venue_id} value={venue.venue_id}>
                  {venue.venue_name}
                </option>
              ))}
            </select>

            <button className="bg-blue-600 text-white rounded-lg px-4 py-2">
              Add Event
            </button>
          </form>
        </section>

        <section className="bg-white rounded-xl shadow p-5 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Update Event Status</h2>

          <form action={updateEventStatus} className="space-y-3">
            <input
              className="w-full border border-gray-300 rounded-lg p-2"
              name="event_id"
              type="number"
              placeholder="Event ID"
              required
            />

            <select
              className="w-full border border-gray-300 rounded-lg p-2"
              name="status"
              required
            >
              <option value="scheduled">scheduled</option>
              <option value="cancelled">cancelled</option>
              <option value="completed">completed</option>
            </select>

            <button className="bg-yellow-500 text-white rounded-lg px-4 py-2">
              Update Status
            </button>
          </form>
        </section>

        <section className="bg-white rounded-xl shadow p-5">
          <h2 className="text-2xl font-semibold mb-4">Delete Event</h2>

          <form action={deleteEvent} className="space-y-3">
            <input
              className="w-full border border-gray-300 rounded-lg p-2"
              name="event_id"
              type="number"
              placeholder="Event ID"
              required
            />

            <button className="bg-red-600 text-white rounded-lg px-4 py-2">
              Delete Event
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
