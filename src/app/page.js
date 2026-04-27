import { pool } from "../lib/db";

export default async function Home() {
  const result = await pool.query(`
  SELECT event_id, title, description
  FROM Event
  ORDER BY event_id;
  `);

  const events = result.rows;

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900 p-8">
    <div className="max-w-3xl mx-auto">
    <h1 className="text-4xl font-bold text-gray-900 mb-2">
    City Events Tracker
    </h1>

    <p className="text-gray-600 mb-8">
    Upcoming events powered by PostgreSQL
    </p>

    <nav className="flex gap-3 mb-8">
    <a className="text-gray-900 hover:underline" href="/">
    Events
    </a>
    <a className="text-blue-600 hover:underline" href="/feed">
    Personalized Feed
    </a>
    <a className="text-blue-600 hover:underline" href="/admin">
    Admin
    </a>
    </nav>

    <div className="space-y-4">
    {events.map((event) => (
      <div
      key={event.event_id}
      className="bg-white rounded-xl shadow p-5"
      >
      <h2 className="text-2xl font-semibold text-gray-900">
      {event.title}
      </h2>

      <p className="text-gray-700 mt-2">
      {event.description}
      </p>
      </div>
    ))}
    </div>
    </div>
    </main>
  );
}
