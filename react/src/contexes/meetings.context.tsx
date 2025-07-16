import { createContext, useEffect, useState } from "react";
import { type Meeting, type MeetingWithoutId } from "../Types";
import { postMeeting, putMeeting, getMeetingsToManager, getMeetingsToCustomer } from "../APIsRequests/Meetings";

type MeetingsContextType = {
    meetings: Meeting[],
    addMeeting: (newMeeting: Meeting, businessId: Number) => Promise<number | null>,
    updateMeeting: (updateMeeting: Meeting) => Promise<void>,
    getMeetingsToManager: () => Promise<Meeting[]>
    getMeetingsToCustomer: (businessId: number) => Promise<Meeting[]>,
    loading?: boolean
}


export const MeetingContext = createContext<Partial<MeetingsContextType>>({});

export const MeetingsProvider = ({ children }: { children: React.ReactNode }) => {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                const token = localStorage.getItem("token");
                const role = localStorage.getItem("role");
                if (token && role === "user") {
                    const data = await getMeetingsToManager();
                    setMeetings(data);
                }
            } catch (error) {
                console.error("Failed to load meetings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMeetings();
    }, []);

    const contextValue: MeetingsContextType = {
        meetings: meetings,
        addMeeting: async (newMeeting: Meeting, businessId: Number) => {
            setMeetings(prevMeetings => [...prevMeetings, newMeeting]);
            const newMeetingWithoutId: MeetingWithoutId = {
                clientId: newMeeting.clientId,
                serviceId: newMeeting.serviceId,
                scheduledAt: newMeeting.scheduledAt,
                meetingStatus: newMeeting.meetingStatus,
                notes: newMeeting.notes,
                meetingDate: newMeeting.meetingDate
            }
            return await postMeeting(newMeetingWithoutId, businessId);
        },
        updateMeeting: async (updateMeeting: Meeting) => {
            const newMeetings = meetings!.map((meeting: Meeting) => meeting.id === updateMeeting.id ? updateMeeting : meeting);
            setMeetings(newMeetings);
            await putMeeting(updateMeeting);
        },
        getMeetingsToManager: async () => {
            const newmeetings = await getMeetingsToManager();
            setMeetings([...newmeetings]);
            return newmeetings;
        },
        getMeetingsToCustomer: async (businessId: number) => {
            return await getMeetingsToCustomer(businessId);
        },
        loading: loading
    }

    if (loading) return <div>טוען פגישות...</div>;

    return <MeetingContext.Provider value={contextValue}>
        {children}
    </MeetingContext.Provider>
}