import Link from "next/link";
import Image from "next/image";

interface props {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}

const EventCard = ({ title, image, slug, location, date, time }: props) => {
  return (
    <div>
      <Link href={`/events/${slug}`} id="event-id">
        <Image
          src={image}
          alt={title}
          width={410}
          height={300}
          className="poster"
        />

        <div className="flex flex-row gap-2">
          <Image src={`/icons/pin.svg`} alt="location" width={14} height={14} />
          <p>{location}</p>
        </div>

        <div className="datetime flex flex-row gap-4">
          <div className="flex flex-row gap-2">
            <Image
              src={`/icons/calendar.svg`}
              alt="date"
              width={14}
              height={14}
            />
            <p>{date}</p>
          </div>

          <div className="flex flex-row gap-2">
            <Image src={`/icons/clock.svg`} alt="time" width={14} height={14} />
            <p>{time}</p>
          </div>
        </div>

        <p className="title">{title}</p>
      </Link>
    </div>
  );
};

export default EventCard;
