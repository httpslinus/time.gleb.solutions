"use client";

import DateInput from "@/components/DateInput";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
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
            <div className="select-none text-2xl [font-variant-numeric:tabular-nums] lg:text-7xl">
              <span className="text-4xl lg:text-9xl">
                {String(passedTime).split(".")[0]}
              </span>
              <span>.</span>
              <span>
                {(String(passedTime).split(".")[1] || "").padEnd(10, "0")}
              </span>
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
            <div className="flex w-full flex-row items-center justify-between">
              <h3 className="leading-4">What&apos;s your birthday?</h3>
              <Link href="https://gleb.solutions" target="_blank">
                <Image
                  src="/dot.png"
                  alt=".solutions logo"
                  width={48}
                  height={48}
                  className="h-4 w-4 object-contain dark:invert"
                />
              </Link>
            </div>

            <div>
              <DateInput setDate={setBirthday} />
            </div>

            <button
              ref={continueButtonRef}
              disabled={birthday === null}
              onClick={() => {
                if (birthday === null) return;
                localStorage.setItem("birthday", birthday.toISOString());
                setView("time");
              }}
              className={clsx(
                "w-full rounded border p-3 transition-all duration-150 focus:outline-none",
                birthday != null &&
                  "border-black bg-transparent text-black hover:bg-black hover:text-white focus:bg-black focus:text-white",
                birthday != null &&
                  "dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black dark:focus:border-white dark:focus:bg-white dark:focus:text-black",
                birthday == null &&
                  "border-neutral-300 text-neutral-300 hover:bg-transparent hover:text-neutral-300",
                birthday == null &&
                  "dark:border-neutral-600 dark:text-neutral-600 dark:hover:bg-transparent dark:hover:text-neutral-600",
              )}
            >
              Continue
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
