import { supabase } from "superbase";

export async function checkFirstLogin(user) {
  const userMetadata = user?.user_metadata || {};

  if (userMetadata.first_login === undefined) {
    // It's the user's first login
    // You can update the user metadata here
    const { error } = await supabase.auth.updateUser({
      data: { first_login: true },
    });

    if (error) {
      console.error("Error updating user metadata:", error);
    }

    console.log("Welcome! This is your first login.");
    const { error: insertError } = await supabase
      .from("applicant_profiles")
      .insert([{ user_id: user.id, created_at: new Date().toISOString() }]);
    if (insertError) throw insertError;
  } else {
    console.log(`Welcome back ${user.id}`);
  }
}

export const isValidDate = (value) => {
  // Check if the value is a string and not empty
  if (typeof value !== "string" || !value.trim()) {
    return false;
  }

  // Regex to detect typical date-like formats (ISO 8601 or similar)
  const isoDateRegex =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?([+-]\d{2}:\d{2}|Z)?$/;

  // Check if the value matches the ISO 8601 format (with optional fractional seconds and timezone)
  if (isoDateRegex.test(value)) {
    const date = new Date(value);
    return !isNaN(date.getTime()) && date.toString() !== "Invalid Date";
  }

  // If it's not a matching date string, check if it's numeric or contains other numbers
  const date = new Date(value);
  return (
    !isNaN(date.getTime()) &&
    date.toString() !== "Invalid Date" &&
    !/\d/.test(value)
  );
};

function getDayWithSuffix(day) {
  const suffixes = ["th", "st", "nd", "rd"];
  const value = day % 100;
  return day + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]);
}

export const formatDate = (value) => {
  if (isValidDate(value)) {
    const date = new Date(value);
    const now = new Date();

    const dayWithSuffix = getDayWithSuffix(date.getDate());

    // Check if the year matches the current year
    if (date.getFullYear() === now.getFullYear()) {
      // If year matches, check if the month matches
      if (date.getMonth() === now.getMonth()) {
        // If month matches, just show the day and time
        return `${dayWithSuffix} ${date
          .toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
          .replace(/,/, "")}`; // Remove the comma
      }
      // If only the year matches, show MM/DD hh:mm
      return `${date
        .toLocaleString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          month: "2-digit",
          day: "2-digit",
          hour12: true,
        })
        .replace(/,/, "")}`;
    }

    // Show the full date with year if it doesn't match the current year
    return `${date
      .toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour12: true,
      })
      .replace(/,/, "")}`;
  }
  return value; // Return original value if not a valid date
};

export function hexToAscii(hex: string) {
  // Check for and remove the prefix "\x" if present
  if (hex.startsWith("\\x")) {
    hex = hex.slice(2); // Remove "\x"
  }

  // Return an empty string if the remaining hex is empty
  if (hex.length === 0 || hex.length % 2 !== 0) {
    return "";
  }

  let str = "";
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16));
  }
  return str;
}
