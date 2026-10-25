import { Schema, model, models, Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: "online" | "offline" | "hybrid";
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
      validate: {
        validator: (title: string) => generateSlug(title).length > 0,
<<<<<<< HEAD
        message: "Title must contain at least one letter or number (a-z, 0-9)",
=======
        message: "Title must produce a valid slug",
>>>>>>> database-models
      },
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    overview: {
      type: String,
      required: [true, "Overview is required"],
      trim: true,
      maxlength: [500, "Overview cannot exceed 500 characters"],
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    date: {
      type: String,
      required: [true, "Date is required"],
    },
    time: {
      type: String,
      required: [true, "Time is required"],
    },
    mode: {
      type: String,
      required: [true, "Mode is required"],
      enum: {
        values: ["online", "offline", "hybrid"],
        message: "Mode must be either online, offline, or hybrid",
      },
    },
    audience: {
      type: String,
      required: [true, "Audience is required"],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, "Agenda is required"],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "At least one agenda item is required",
      },
    },
    organizer: {
      type: String,
      required: [true, "Organizer is required"],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, "Tags are required"],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "At least one tag is required",
      },
    },
  },
  {
    timestamps: true,
  },
);

<<<<<<< HEAD
// Pre-save hook for slug generation and data normalization
=======
// Pre-save: generate slug + normalize date/time
// Mongoose 9: no `next` parameter — just throw to reject the save
>>>>>>> database-models
EventSchema.pre("save", function () {
  const event = this as IEvent;

  if (event.isModified("title") || event.isNew) {
    event.slug = generateSlug(event.title);
  }

  if (event.isModified("date")) {
    event.date = normalizeDate(event.date);
  }

  if (event.isModified("time")) {
    event.time = normalizeTime(event.time);
  }
});

/** Convert title → URL-friendly slug */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Normalize date to YYYY-MM-DD.
 * Also rejects invalid calendar dates (e.g. Feb 30).
 */
function normalizeDate(dateString: string): string {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format");
  }

<<<<<<< HEAD
  const dateParts = dateString
    .trim()
    .match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:$|[T\s])/);
  if (dateParts) {
    const [, year, month, day] = dateParts;
    // Check the input's calendar date separately from timestamp timezone offsets.
    const calendarDate = new Date(
      `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T00:00:00Z`,
    );
    if (
      calendarDate.getUTCFullYear() !== Number(year) ||
      calendarDate.getUTCMonth() + 1 !== Number(month) ||
      calendarDate.getUTCDate() !== Number(day)
    ) {
      throw new Error("Invalid date format");
    }
  }

  return date.toISOString().split("T")[0]; // Return YYYY-MM-DD format
=======
  // Prevent Date constructor roll-over (e.g. 2025-02-30 → March)
  const [year, month, day] = dateString.split(/[-/T]/).map(Number);
  if (
    year &&
    month &&
    day &&
    (date.getUTCFullYear() !== year ||
      date.getUTCMonth() + 1 !== month ||
      date.getUTCDate() !== day)
  ) {
    throw new Error("Invalid calendar date");
  }

  return date.toISOString().split("T")[0];
>>>>>>> database-models
}

/** Normalize time to HH:MM (24-hour) */
function normalizeTime(timeString: string): string {
  const timeRegex = /^(\d{1,2}):(\d{2})(\s*(AM|PM))?$/i;
  const match = timeString.trim().match(timeRegex);

  if (!match) {
    throw new Error("Invalid time format. Use HH:MM or HH:MM AM/PM");
  }

  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const period = match[4]?.toUpperCase();

  if (period) {
<<<<<<< HEAD
    if (hours < 1 || hours > 12) {
      throw new Error("Invalid time values");
    }
    // Convert 12-hour to 24-hour format
=======
    // 12-hour format → reject hours outside 1-12
    if (hours < 1 || hours > 12) {
      throw new Error("Hour must be between 1 and 12 when using AM/PM");
    }
>>>>>>> database-models
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
  }

  if (hours < 0 || hours > 23 || parseInt(minutes, 10) > 59) {
    throw new Error("Invalid time values");
  }

  return `${hours.toString().padStart(2, "0")}:${minutes}`;
}

EventSchema.index({ slug: 1 }, { unique: true });
EventSchema.index({ date: 1, mode: 1 });

const Event = models.Event || model<IEvent>("Event", EventSchema);

export default Event;
