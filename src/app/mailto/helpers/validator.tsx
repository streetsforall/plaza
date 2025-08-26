"use server";

import { NextResponse } from "next/server";
import { getSaved } from "./saved_emails";

export async function validateString(pwd, hash) {
    console.log(pwd, hash);
    console.log(process.env.LOGIN);
  
    try {
      console.log("loading emails");
      // ✅ Direct await of getSaved
      const emails = await getSaved(hash);
      console.log("response", emails);
      
      if (pwd === process.env.LOGIN) {
        return { 'emails': emails, 'valid': true };
      } else {
        return { 'emails': {}, 'valid': false };
      }
    } catch (err) {
      console.error("Error in validateString:", err);
      return { 'emails': {}, 'valid': false };
    }
  }
