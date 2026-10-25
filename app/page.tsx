import ExploreButton from "@/components/ExploreButton";

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

        <ul>
          {[1, 2, 3, 4, 5].map((event) => (
            <li key={event}>Event {event}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default page;
