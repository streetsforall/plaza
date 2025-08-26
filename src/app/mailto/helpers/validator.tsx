import { NextResponse } from "next/server";

export function validateString(pwd: string) {
  if (pwd == process.env.PASSWORD) {
    return true;
  } else {
    return false;
  }
}
