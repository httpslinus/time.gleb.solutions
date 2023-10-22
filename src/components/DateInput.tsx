import clsx from "clsx";
import { Fragment, useEffect, useRef, useState } from "react";

interface Props {
  setDate: (date: Date | null) => void;
}

const DateInput = ({
  setDate,
  ...props
}: Props & React.ComponentPropsWithoutRef<"div">) => {
  const [error, setError] = useState<boolean>(false);
  const [digits, setDigits] = useState<(string | null)[]>(Array(8).fill(null));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(-1);
  const [americanFormat, setDateFormat] = useState<boolean>(false);
  const refs = Array.from({ length: 8 }, () => useRef<HTMLInputElement>(null));

  useEffect(() => {
    setDateFormat(
      (navigator.language || navigator.languages).includes("en-US"),
    );
  }, []);

  useEffect(() => {
    const day = americanFormat
      ? parseInt(digits.slice(2, 4).join(""))
      : parseInt(digits.slice(0, 2).join(""));
    const month = americanFormat
      ? parseInt(digits.slice(0, 2).join(""))
      : parseInt(digits.slice(2, 4).join(""));
    const year = parseInt(digits.slice(4, 8).join(""));
    const date = new Date(year, month, day);

    if (digits.every((d) => d !== null)) {
      if (isNaN(date.getTime())) {
        setError(true);
      }
      if (date > new Date()) {
        setError(true);
      }
    } else {
      setDate(null);
    }

    if (
      digits.every((d) => d !== null) &&
      !isNaN(date.getTime()) &&
      date < new Date()
    ) {
      setDate(date);
      refs[refs.length - 1].current?.blur();
      setError(false);
    }
  }, [digits]);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    e.preventDefault();
    const value = e.key;

    if (/^[0-9]$/.test(value)) {
      setDigits((prevDigits) => {
        const newDigits = [...prevDigits];
        newDigits[index] = value;
        return newDigits;
      });

      if (index < refs.length - 1) {
        const nextInput = refs[index + 1];
        if (nextInput.current) {
          nextInput.current.focus();
        }
      }
    }

    if (e.key === "Backspace") {
      if (digits[index] !== null) {
        setDigits((prevDigits) => {
          const newDigits = [...prevDigits];
          newDigits[index] = null;
          return newDigits;
        });
      } else if (index > 0) {
        setDigits((prevDigits) => {
          const newDigits = [...prevDigits];
          newDigits[index - 1] = null;
          return newDigits;
        });

        const prevInput = refs[index - 1];
        if (prevInput.current) {
          prevInput.current.focus();
        }
      }
      e.preventDefault();
    }
  };

  return (
    <div className="flex items-center gap-1" {...props}>
      {Array.from({ length: 8 }).map((_, index) => (
        <Fragment key={index}>
          <input
            key={index}
            ref={refs[index]}
            type="tel"
            inputMode="numeric"
            maxLength={1}
            placeholder={
              (americanFormat ? "MM/DD/YYYY" : "DD/MM/YYYY")
                .split("/")
                .join("")
                .split("")[index]
            }
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(null)}
            className={clsx(
              "bg-transparent text-black placeholder-neutral-300",
              "dark:text-white dark:placeholder-neutral-600",
              "h-10 w-8 rounded border text-center text-base caret-transparent outline-none transition-all duration-150 focus:outline-none",
              error && digits.every((d) => d !== null) && "border-red-500",
              focusedIndex === index || digits[index] !== null
                ? "border-black dark:border-white"
                : "border-neutral-300 dark:border-neutral-600",
            )}
            defaultValue={digits[index] ?? ""}
            onKeyDown={(e) => handleKeyDown(e, index)}
          />
          {index === 1 || index === 3 ? <span className="w-1"></span> : null}
        </Fragment>
      ))}
    </div>
  );
};

export default DateInput;
