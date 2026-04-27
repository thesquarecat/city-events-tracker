-- Q1 SELECT: User's personalized feed
SELECT DISTINCT e.event_id, e.title, e.start_datetime, a.area_name
FROM Event e
JOIN Area a ON e.area_id = a.area_id
WHERE e.status = 'scheduled'
  AND e.start_datetime >= NOW()
  AND (
      e.area_id IN (
          SELECT area_id
          FROM UserAreaSub
          WHERE user_id = 2
      )
      OR
      e.event_id IN (
          SELECT ec.event_id
          FROM EventCategory ec
          JOIN UserCategorySub ucs ON ec.category_id = ucs.category_id
          WHERE ucs.user_id = 2
      )
  )
ORDER BY e.start_datetime;

-- Q2 SELECT: Browse and filter events
SELECT e.event_id, e.title, e.start_datetime, a.area_name
FROM Event e
JOIN Area a ON e.area_id = a.area_id
JOIN EventCategory ec ON e.event_id = ec.event_id
JOIN Category c ON ec.category_id = c.category_id
WHERE e.status = 'scheduled'
  AND e.start_datetime BETWEEN NOW() AND NOW() + INTERVAL '7 days'
  AND a.area_name = 'Tempe'
  AND c.category_name = 'Concert'
ORDER BY e.start_datetime;

-- Q3 INSERT: Admin adds a new disruption
INSERT INTO Event (
    title, description, start_datetime, end_datetime, status, created_by, area_id, venue_id
) VALUES (
    'Food Truck Festival',
    'Food trucks with live music.',
    '2026-05-16 11:00:00-07',
    '2026-05-17 21:00:00-07',
    'scheduled',
    1,
    1,
    1
);

-- Q4 UPDATE: Admin updates an existing event
UPDATE Event
SET end_datetime = '2026-04-05 18:00:00-07'
WHERE event_id = 2;

-- Q5 DELETE: Admin removes an event
DELETE FROM EventCategory
WHERE event_id = 2;

DELETE FROM Event
WHERE event_id = 2;
