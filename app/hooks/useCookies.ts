import { useState } from "react";

const getHashFromCookies = () => {
  if (typeof window === "undefined") return {};
  return document.cookie.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.split("=");
    return { ...acc, [key.trim()]: value };
  }, {});
};

export function useCookies() {
  const [cookies, setCookieState] = useState<{ [key: string]: string }>(
    getHashFromCookies()
  );

  const setCookie = (key: string, value: string, days = 7) => {
    const expires = new Date();
    expires.setDate(expires.getDate() + days);

    document.cookie = `${key}=${value}; expires=${expires.toUTCString()}; path=/`;
    setCookieState(getHashFromCookies());
  };

  return { cookies, setCookie };
}
