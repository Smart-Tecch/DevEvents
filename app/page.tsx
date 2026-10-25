import EventCard from "@/components/EventCard";
import ExploreButton from "@/components/ExploreButton";
import { events } from "@/libs/constants";

const page = () => {
  return (
    <section>
      <h1 className="text-center">
        The hub for Every Dev <br /> Event you {`can't`} Miss
      </h1>
      <p className="text-center mt-5">
        Hacathons, Meetups, and Conferences, All in One Place
      </p>
      <ExploreButton />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        <ul className="events">
          {events.map((event) => (
            <EventCard key={event.title} {...event}></EventCard>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default page;
