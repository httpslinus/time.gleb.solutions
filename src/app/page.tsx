"use client";

import DateInput from "@/components/DateInput";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [view, setView] = useState<"birthday" | "time">("birthday");
  const [passedTime, setPassedTime] = useState<number>(0);
  const continueButtonRef = useRef<HTMLButtonElement>(null);

  // Focus continue button when birthday is set
  useEffect(() => {
    if (continueButtonRef && birthday !== null) {
      continueButtonRef.current?.focus();
    }
  }, [birthday]);

  // Load birthday from local storage
  useEffect(() => {
    const birthday = localStorage.getItem("birthday");
    if (birthday) {
      const date = new Date(birthday);
      if (!isNaN(date.getTime())) {
        setBirthday(date);
        setView("time");
      }
    }
  }, []);

  // Update passed time
  useEffect(() => {
    if (birthday) {
      setPassedTime(getPassedTime(birthday));
    }

    const intervalId = setInterval(() => {
      if (birthday) {
        setPassedTime(getPassedTime(birthday));
      }
    }, 1);

    return () => {
      clearInterval(intervalId);
    };
  }, [birthday]);

  const getPassedTime = (pastDate: Date): number => {
    const currentDate = new Date();
    const msInYear = 1000 * 60 * 60 * 24 * 365.25;

    const diffInMs = currentDate.getTime() - pastDate.getTime();
    const years = diffInMs / msInYear;

    return parseFloat(years.toFixed(10));
  };

  return (
    <main className="flex h-full w-full items-center justify-center">
      <AnimatePresence mode="wait">
        {view === "time" && passedTime && (
          <motion.div
            key="time"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="cursor-pointer"
            onClick={() => {
              setView("birthday");
              setBirthday(null);
              localStorage.removeItem("birthday");
            }}
          >
            <div className="select-none text-2xl [font-variant-numeric:tabular-nums]">
              <span className="text-4xl">
                {String(passedTime).split(".")[0]}
              </span>
              <span>.</span>
              <span>{String(passedTime).split(".")[1].padEnd(10, "0")}</span>
            </div>
          </motion.div>
        )}
        {view === "birthday" && (
          <motion.div
            key="birthday"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col items-start justify-start gap-3"
          >
            <motion.h3 layout className="leading-4">
              Your Birthday
            </motion.h3>

            <motion.div layout>
              <DateInput setDate={setBirthday} />
            </motion.div>

            {birthday !== null && (
              <motion.button
                layout
                ref={continueButtonRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                onClick={() => {
                  localStorage.setItem("birthday", birthday.toISOString());
                  setView("time");
                }}
                className={clsx(
                  "w-full rounded border p-3 transition-all duration-150 focus:outline-none",
                  "border-black bg-transparent text-black hover:bg-black hover:text-white focus:bg-black focus:text-white",
                  "dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black dark:focus:border-white dark:focus:bg-white dark:focus:text-black",
                )}
              >
                Continue
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
