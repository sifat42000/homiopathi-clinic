"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Clock3,
} from "lucide-react";

type DiscountCountdownProps = {
  startAt?: string;

  endAt?: string;

  enabled?: boolean;
};

type RemainingTime = {
  days: number;

  hours: number;

  minutes: number;

  seconds: number;
};

function getRemainingTime(
  target: number,
  now: number
): RemainingTime {
  const difference =
    Math.max(
      target - now,
      0
    );

  const totalSeconds =
    Math.floor(
      difference / 1000
    );

  return {
    days:
      Math.floor(
        totalSeconds /
          86400
      ),

    hours:
      Math.floor(
        (totalSeconds %
          86400) /
          3600
      ),

    minutes:
      Math.floor(
        (totalSeconds %
          3600) /
          60
      ),

    seconds:
      totalSeconds % 60,
  };
}

export default function DiscountCountdown({
  startAt,
  endAt,
  enabled,
}: DiscountCountdownProps) {
  const [
    now,
    setNow,
  ] = useState<
    number | null
  >(null);

  useEffect(() => {
    if (
      !enabled ||
      !startAt ||
      !endAt
    ) {
      return;
    }

    setNow(
      Date.now()
    );

    const timer =
      window.setInterval(
        () => {
          setNow(
            Date.now()
          );
        },
        1000
      );

    return () => {
      window.clearInterval(
        timer
      );
    };
  }, [
    enabled,
    startAt,
    endAt,
  ]);

  if (
    !enabled ||
    !startAt ||
    !endAt ||
    now === null
  ) {
    return null;
  }

  const start =
    new Date(
      startAt
    ).getTime();

  const end =
    new Date(
      endAt
    ).getTime();

  if (
    Number.isNaN(start) ||
    Number.isNaN(end)
  ) {
    return null;
  }

  /* Offer not started */
  if (now < start) {
    const remaining =
      getRemainingTime(
        start,
        now
      );

    return (
      <div className="mt-3 rounded-xl bg-blue-50 px-3 py-3">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-700">
          <Clock3
            size={15}
          />

          Offer শুরু হতে বাকি
        </div>

        <div className="font-english mt-2 flex flex-wrap gap-2">
          <TimeBox
            value={
              remaining.days
            }
            label="Days"
          />

          <TimeBox
            value={
              remaining.hours
            }
            label="Hours"
          />

          <TimeBox
            value={
              remaining.minutes
            }
            label="Min"
          />

          <TimeBox
            value={
              remaining.seconds
            }
            label="Sec"
          />
        </div>
      </div>
    );
  }

  /* Offer expired */
  if (now >= end) {
    return null;
  }

  const remaining =
    getRemainingTime(
      end,
      now
    );

  return (
    <div className="mt-3 rounded-xl bg-red-50 px-3 py-3">
      <div className="flex items-center gap-2 text-xs font-bold text-red-600">
        <Clock3
          size={15}
        />

        Offer শেষ হতে বাকি
      </div>

      <div className="font-english mt-2 flex flex-wrap gap-2">
        <TimeBox
          value={
            remaining.days
          }
          label="Days"
        />

        <TimeBox
          value={
            remaining.hours
          }
          label="Hours"
        />

        <TimeBox
          value={
            remaining.minutes
          }
          label="Min"
        />

        <TimeBox
          value={
            remaining.seconds
          }
          label="Sec"
        />
      </div>
    </div>
  );
}

function TimeBox({
  value,
  label,
}: {
  value: number;

  label: string;
}) {
  return (
    <div className="min-w-[50px] rounded-lg bg-white px-2 py-1.5 text-center shadow-sm">
      <p className="font-bold text-gray-900">
        {String(
          value
        ).padStart(
          2,
          "0"
        )}
      </p>

      <p className="text-[9px] uppercase text-gray-400">
        {label}
      </p>
    </div>
  );
}