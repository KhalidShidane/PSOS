import mongoose from "mongoose";

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

const timeField = () => ({
  type: String,
  required: true,
  match: [TIME_PATTERN, "Time must be in HH:MM 24-hour format"],
});

const prayerScheduleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fajr: timeField(),
    dhuhr: timeField(),
    asr: timeField(),
    maghrib: timeField(),
    isha: timeField(),
    date: {
      type: Date,
      default: null,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

prayerScheduleSchema.index({ user: 1, date: 1 });

export default mongoose.model("PrayerSchedule", prayerScheduleSchema);
