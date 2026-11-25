"use client";

import { useEffect } from "react";
import { alignSeatCookie } from "@/features/booking/utils/pending-payment";

export default function SeatCookieAlign() {
  useEffect(() => {
    alignSeatCookie();
  }, []);

  return null;
}
