"use server";

import { NextResponse } from "next/server";
import { getSaved } from "./saved_emails";

export async function validateString(pwd, hash) {
    console.log(pwd, hash);
    console.log(process.env.LOGIN);
  
    if (pwd !== process.env.LOGIN) {
      return { 'emails': {}, 'valid': false };
    }

    try {
      console.log("loading emails");
      const emails = await getSaved(hash);
      console.log("response", emails);
      return { 'emails': emails, 'valid': true };
    } catch (err) {
      console.error("Error in validateString:", err);
      return { 'emails': {}, 'valid': true };
    }
  }
