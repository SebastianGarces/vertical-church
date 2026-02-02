import { getEvents } from "@/lib/planning-center";
import { getEventsSchema, JsonLd } from "@/lib/json-ld";
import { EventCard } from "./EventCard";

export async function EventsList() {
  const events = await getEvents();

  if (events.length === 0) {
    return (
      <section className="bg-navy pb-16 md:pb-24">
        <div className="mx-auto max-w-[1080px] px-4 md:px-8">
          <div className="rounded-lg border border-salte/30 bg-navy/50 p-8 text-center">
            <p className="font-body text-lg text-pipper/70">
              No upcoming events at this time. Check back soon!
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Generate Event schemas for AI discoverability
  const eventsSchema = getEventsSchema(events);

  return (
    <section className="bg-navy pb-16 md:pb-24">
      {/* Event structured data for AI systems */}
      {eventsSchema.length > 0 && <JsonLd data={eventsSchema} />}
      <div className="mx-auto max-w-[1080px] px-4 md:px-8">
        <div className="flex flex-col gap-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
