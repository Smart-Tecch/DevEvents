import { Schema, model, models, Document, Types } from "mongoose";
import Event from "./event.model";

export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: (email: string) => {
          const emailRegex =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
          return emailRegex.test(email);
        },
        message: "Please provide a valid email address",
      },
    },
  },
  {
    timestamps: true,
  },
);

<<<<<<< HEAD
// Pre-save hook to validate events exists before creating booking
=======
// Pre-save: ensure the referenced Event actually exists
// Mongoose 9: no `next` — throw to reject the save
>>>>>>> database-models
BookingSchema.pre("save", async function () {
  const booking = this as IBooking;

  if (booking.isModified("eventId") || booking.isNew) {
    let eventExists;
    try {
<<<<<<< HEAD
      eventExists = await Event.findById(booking.eventId).select("_id");
    } catch {
=======
      const eventExists = await Event.findById(booking.eventId).select("_id");

      if (!eventExists) {
        const error = new Error(
          `Event with ID ${booking.eventId} does not exist`,
        );
        error.name = "ValidationError";
        throw error;
      }
    } catch (err) {
      if (err instanceof Error && err.name === "ValidationError") {
        throw err;
      }
>>>>>>> database-models
      const validationError = new Error(
        "Invalid event ID format or database error",
      );
      validationError.name = "ValidationError";
      throw validationError;
<<<<<<< HEAD
    }

    if (!eventExists) {
      const error = new Error(`Event with ID ${booking.eventId} does not exist`);
      error.name = "ValidationError";
      throw error;
=======
>>>>>>> database-models
    }
  }
});

BookingSchema.index({ eventId: 1 });
BookingSchema.index({ eventId: 1, createdAt: -1 });
BookingSchema.index({ email: 1 });
BookingSchema.index(
  { eventId: 1, email: 1 },
  { unique: true, name: "uniq_event_email" },
);

const Booking = models.Booking || model<IBooking>("Booking", BookingSchema);

export default Booking;
