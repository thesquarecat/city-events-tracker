import { pool } from "../../lib/db";

export default async function FeedPage() {
  const result = await pool.query(`
    SELECT DISTINCT e.event_id, e.title, e.description, a.area_name
    FROM Event e
    JOIN Area a ON e.area_id = a.area_id
    WHERE e.status = 'scheduled'
      AND (
        e.area_id IN (
          SELECT area_id FROM UserAreaSub WHERE user_id = 2
        )
        OR e.event_id IN (
          SELECT ec.event_id
          FROM EventCategory ec
          JOIN UserCategorySub ucs ON ec.category_id = ucs.category_id
          WHERE ucs.user_id = 2
        )
      )
    ORDER BY e.event_id;
  `);

  const events = result.rows;

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Personalized Feed</h1>
        <p className="text-gray-600 mb-4">
          Events matching sample user subscriptions.
        </p>

        <nav className="flex gap-4 mb-8">
          <a className="text-blue-600 hover:underline font-medium" href="/">Events</a>
          <a className="text-gray-900 hover:underline font-medium" href="/feed">Personalized Feed</a>
          <a className="text-blue-600 hover:underline font-medium" href="/admin">Admin</a>
        </nav>

        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.event_id} className="bg-white rounded-xl shadow p-5">
              <h2 className="text-2xl font-semibold">{event.title}</h2>
              <p className="text-sm text-gray-500 mt-1">{event.area_name}</p>
              <p className="text-gray-700 mt-2">{event.description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
