import Image from "next/image";
import React from "react";

export default function Footer() {
  return (
    <footer className="row-start-3 flex flex-wrap items-center justify-center gap-6">
      <a
        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        href="https://t.me/nullOn"
        rel="noopener noreferrer"
        target="_blank"
      >
        <Image
          alt="Telegram icon"
          aria-hidden
          height={18}
          src="/Telegram_logo.svg"
          width={18}
        />
        Telegram
      </a>
      <a
        className="flex items-center gap-2  hover:underline hover:underline-offset-4"
        href="https://github.com/ivankhrsh"
        rel="noopener noreferrer"
        target="_blank"
      >
        <Image
          alt="GitHub icon"
          aria-hidden
          height={18}
          src="https://nextjs.org/icons/github.svg"
          width={18}
        />
        GitHub
      </a>
    </footer>
  );
}
