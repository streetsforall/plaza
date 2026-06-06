"use server";

import { getEmailTemplate } from "./db";

export async function validateString(pwd, hash) {
    console.log(pwd, hash);
    console.log(process.env.LOGIN);
  
    if (pwd !== process.env.LOGIN) {
      return { 'emails': {}, 'valid': false };
    }

    try {
      console.log("loading emails");

      const emails = await getEmailTemplate(hash);
      console.log("response", emails);

      return { 'emails': emails, 'valid': true };
    } catch (err) {
      console.error("Error in validateString:", err);

      return { 'emails': {}, 'valid': true };
    }
  }
