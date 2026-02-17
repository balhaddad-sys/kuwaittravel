"use client";
import { useState, useEffect } from "react";

interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  isExpired: boolean;
  label: string;
}

export function useCountdown(targetDate: Date | null): CountdownResult {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!targetDate) return;
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!targetDate) return { days: 0, hours: 0, minutes: 0, isExpired: true, label: "" };

  const diff = targetDate.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, isExpired: true, label: "" };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  let label = "";
  if (days > 0) label = `${days}d ${hours}h`;
  else if (hours > 0) label = `${hours}h ${minutes}m`;
  else label = `${minutes}m`;

  return { days, hours, minutes, isExpired: false, label };
}
