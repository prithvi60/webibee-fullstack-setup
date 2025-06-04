import { format, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export function formatExpiryTime(expiresAt: string): string {
    // Parse the UTC timestamp
    const utcDate = parseISO(expiresAt);

    // Convert to Asia/Kolkata timezone (GMT +05:30)
    const istDate = toZonedTime(utcDate, "Asia/Kolkata");

    // Format as "Month Day, Year Hour:Minute AM/PM"
    return format(istDate, "MMMM d, yyyy h:mm a");
}

export function formatExpiryTime2(timestamp: number | string | Date): string {
    try {
        const date = new Date(timestamp);

        if (isNaN(date.getTime())) {
            return "Invalid date";
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        // Get hours in 12-hour format
        let hours = date.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours || 12; // Convert 0 to 12 for 12-hour format

        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;
    } catch (error) {
        console.error("Error formatting date:", error);
        return "Date format error";
    }
}