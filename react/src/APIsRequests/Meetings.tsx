import { type Meeting, type MeetingWithoutId } from "../Types";
import axios, { type AxiosResponse } from "axios";
import { api } from "./Generate";

// function getIsraelTimeAsDate(dateUTC: Date): Date {
//     const formatter = new Intl.DateTimeFormat("en-US", {
//       timeZone: "Asia/Jerusalem",
//       year: "numeric",
//       month: "2-digit",
//       day: "2-digit",
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//       hour12: false,
//     });
  
//     const parts = formatter.formatToParts(dateUTC).reduce((acc, part) => {
//       if (part.type !== "literal") acc[part.type] = part.value;
//       return acc;
//     }, {} as Record<string, string>);
  
//     const iso = `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`;
//     return new Date(iso);
//   }

export const getMeetingsToManager: () => Promise<Meeting[]> = async () => {
    try {
        const response: AxiosResponse<Meeting[]> = await api.get("/meetings");
        // const meetingList = response.data.map(meeting => {
        //     const meetingDate = new Date(meeting.meetingDate);
        //     // Convert the UTC date
        //     const israelTimeDate = getIsraelTimeAsDate(meetingDate);
        //     // Create a new Meeting object with the converted date
        //     return {
        //         ...meeting,
        //         meetingDate: israelTimeDate,
        //     };
        // });
        // // Return the list of meetings
        return response.data;
    }
    catch (error) {
        console.error('Unable to get items. ' + error);
    }
    return [];
}

export const getMeetingsToCustomer: (businessId: number) => Promise<Meeting[]> = async (businessId: number) => {
    try {
        const response: AxiosResponse<Meeting[]> = await api.get(`/meetings/byBusinessId/${businessId}`);
        // const meetingList = response.data.map(meeting => {
        //     const meetingDate = new Date(meeting.meetingDate);
        //     // Convert the UTC date
        //     const israelTimeDate = getIsraelTimeAsDate(meetingDate);
        //     // Create a new Meeting object with the converted date
        //     return {
        //         ...meeting,
        //         meetingDate: israelTimeDate,
        //     };
        // });
        // // Return the list of meetings
        return response.data;
    }
    catch (error) {
        console.error('Unable to get items. ' + error);
    }
    return [];
}

export const putMeeting: (updateMeeting: Meeting) => Promise<void> = async (updateMeeting: Meeting) => {
    try {
        const response: AxiosResponse = await api.put(`/meetings/${updateMeeting.id}`, { newMeeting: updateMeeting });
        return response.data;
    }
    catch (error) {
        console.error('Unable to update item. ' + error);
    }
    return null;
}

export const postMeeting: (newMeeting: MeetingWithoutId, businessId: Number) => Promise<number | null> = async (newMeeting: MeetingWithoutId, businessId: Number) => {
    try {
        const utcDate = newMeeting.meetingDate;
        newMeeting.meetingDate = utcDate;
        const response: AxiosResponse = await api.post(`/meetings/${businessId}`, { newMeeting: newMeeting });
        return response.status;
    }
    catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response && error.response.status === 410)
            return 410;
        console.error('Unable to add item. ' + error);
    }
    return null;
}