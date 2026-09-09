export const APPOINTMENT_TIME_SLOTS = [
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",

  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
  "06:00 PM",
  "06:30 PM",
  "07:00 PM",
  "07:30 PM",
] as const;

export function getDhakaDateInfo() {
  const formatter =
    new Intl.DateTimeFormat(
      "en-GB",
      {
        timeZone:
          "Asia/Dhaka",

        year: "numeric",

        month: "2-digit",

        day: "2-digit",

        hour: "2-digit",

        minute: "2-digit",

        hourCycle: "h23",
      }
    );

  const parts =
    formatter.formatToParts(
      new Date()
    );

  const values =
    Object.fromEntries(
      parts.map(
        (part) => [
          part.type,
          part.value,
        ]
      )
    );

  return {
    date: `${values.year}-${values.month}-${values.day}`,

    hour:
      Number(values.hour),

    minute:
      Number(values.minute),
  };
}

export function isValidDateString(
  value: string
) {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(
      value
    )
  ) {
    return false;
  }

  const date =
    new Date(
      `${value}T00:00:00Z`
    );

  return (
    !Number.isNaN(
      date.getTime()
    ) &&
    date
      .toISOString()
      .slice(0, 10) ===
      value
  );
}

export function isPastAppointmentDate(
  date: string
) {
  const now =
    getDhakaDateInfo();

  return date < now.date;
}

export function timeToMinutes(
  time: string
) {
  const match =
    time.match(
      /^(\d{1,2}):(\d{2})\s(AM|PM)$/
    );

  if (!match) {
    return -1;
  }

  let hour =
    Number(match[1]);

  const minute =
    Number(match[2]);

  const period =
    match[3];

  if (
    period === "AM" &&
    hour === 12
  ) {
    hour = 0;
  }

  if (
    period === "PM" &&
    hour !== 12
  ) {
    hour += 12;
  }

  return (
    hour * 60 +
    minute
  );
}

export function getAvailableTimeSlots(
  date: string,
  bookedTimes: string[]
) {
  const booked =
    new Set(
      bookedTimes
    );

  const now =
    getDhakaDateInfo();

  const currentMinutes =
    now.hour * 60 +
    now.minute;

  return APPOINTMENT_TIME_SLOTS.filter(
    (time) => {
      if (
        booked.has(time)
      ) {
        return false;
      }

      /*
        আজকের Date হলে already
        চলে যাওয়া slot দেখাবে না।
        30 minute buffer রাখছি।
      */
      if (
        date === now.date
      ) {
        return (
          timeToMinutes(
            time
          ) >
          currentMinutes + 30
        );
      }

      return true;
    }
  );
}