"use client";

import { useState } from "react";
import {
  CalendarTrigger,
  DateSelectionPopup,
} from "@/src/app/admin/[id]/components/Calendar";

export default function DashboardCalendarControls() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <>
      <CalendarTrigger onClick={() => setIsPopupOpen(true)} />
      <DateSelectionPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />
    </>
  );
}
