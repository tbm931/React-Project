import { useContext, useEffect, useState } from "react";
import { getBusiness } from "../APIsRequests/Business"
import { Status, type Business, type Meeting, type Service } from "../Types"
import { ServiceContext } from "../contexes/services.context";
import { useParams } from "react-router-dom";
import { MeetingContext } from "../contexes/meetings.context";
import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import PaperComponent from "./Paper";

const businessDetails = () => {
    const [meetDateIsNotValid, setMeetDateIsNotValid] = useState(false);
    const { getServicesByIdContext } = useContext(ServiceContext);
    const { id } = useParams();
    const [open, setOpen] = React.useState(false);
    const { services } = useContext(ServiceContext);
    const { addMeeting } = useContext(MeetingContext);
    const [loading, setLoading] = useState(true);
    const [enableService, setEnableService] = useState<boolean[]>([]);
    const [servicesState, setServicesState] = useState<Service[]>([]);
    const [meetingDate, setMeetingDate] = useState<Date>(new Date());
    const [notes, setNotes] = useState<string>("");
    const [serviceId, setServiceId] = useState<number>(0);
    // const [showCreateMeeting, setShowCreateMeeting] = useState(false);
    const [business, setBusiness] = useState<Business>({
        businessAddress: "",
        businessName: "",
        details: "",
        email: "",
        id: 0,
        phone: "",
        userId: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            await getServicesByIdContext!(Number(id));
            setLoading(false);
            setBusiness(await getBusiness(parseInt(id!)));
        }
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (Array.isArray(services)) {
                setServicesState(services);
                setEnableService(Array(services.length).fill(false));
            } else {
                console.warn("services is not an array:", services);
                setServicesState([]);
                setEnableService([]);
            }
            setLoading(false);
        }
        fetchData();
    }, [services]);

    // const handleChangeAddService = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const { name, value, type, checked } = e.target;
    //     setFormData(prev => ({
    //         ...prev,
    //         [name]: type === 'checkbox' ? checked : value
    //     }));
    // };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = async () => {
        setOpen(false);
    };

    const createMeeting = async () => {
        const newMeeting: Meeting = {
            clientId: JSON.parse(window.localStorage.getItem("client")!).id,
            id: 0,
            meetingDate: meetingDate,
            meetingStatus: Status.Scheduled,
            notes: notes,
            scheduledAt: new Date(),
            serviceId: servicesState[serviceId].id
        }
        const status = await addMeeting!(newMeeting, Number(id));
        if (status === 200) {
            alert("פגישה נקבעה בהצלחה");
            setOpen(false);
            setMeetingDate(new Date());
            setNotes("");
        }
        else if (status === 410) {
            alert("לא ניתן לקבוע פגישה בשעה זו, נסה שעה אחרת");
            setMeetDateIsNotValid(true);
        }
        else {
            alert("אירעה שגיאה, נסה שנית מאוחר יותר");
        }
    }

    if (loading)
        return <>Loading...</>
    return (
        <>
            <p style={{ whiteSpace: "pre" }}>
                {business.businessName}     |     {business.businessAddress}     |     {business.email}     |     {business.phone}
            </p>
            <div style={{ display: "flex", justifyContent: "space-evenly", marginTop: "5%", flexWrap: "wrap", gap: "20px" }}>
                {servicesState.filter((service) => service.isActive).map((service: Service, index: number) => (
                    <div key={index} style={{ border: "solid 3px rgba(0, 0, 0, 0.415)", borderRadius: "12px", flexBasis: "250px", paddingBottom: "1%" }}>
                        <div style={{ display: "flex", width: "100%", textAlign: "right" }}>
                            <div style={{ display: "inline-block", textAlign: "right", paddingRight: "3%", fontWeight: "bold" }}>
                                <p style={{ height: "40px" }}>שם: </p>
                                <p style={{ height: "60px" }}>תאור: </p>
                                <p style={{ height: "30px", paddingBottom: "10px" }}>אורך פגישה: </p>
                                <p>מחיר: </p>
                            </div>
                            <div style={{ display: "inline-block", paddingLeft: "3%" }}>
                                <p style={{ height: "40px" }}>{service.serviceName}</p>
                                <p style={{ height: "60px" }}>{service.serviceDescription}</p>
                                <p style={{ height: "30px", paddingBottom: "10px" }}>{service.durationMinutes}</p>
                                <p>{service.price}</p>
                            </div>
                        </div>
                        <React.Fragment>
                            <Button disabled={enableService[index]} variant="outlined" onClick={() => { handleClickOpen(); setServiceId(index); }}>
                                לקביעת פגישה
                            </Button>
                            <Dialog
                                open={open}
                                onClose={handleClose}
                                PaperComponent={PaperComponent}
                                slotProps={{
                                    backdrop: {
                                        sx: {
                                            backgroundColor: "rgba(0, 0, 0, 0.2)",
                                        },
                                    },
                                    paper: {
                                        sx: {
                                            boxShadow: 'none',
                                        },
                                    },
                                }}
                            >
                            <DialogTitle style={{ cursor: 'move', direction: "rtl", fontSize: "25px", fontWeight: "bold" }} >
                                פגישה חדשה
                            </DialogTitle>
                            <DialogContent dir="rtl">
                                <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
                                    <div>
                                        <div>שם השירות:</div>
                                        <div>תיאור:</div>
                                        <div>משך זמן:</div>
                                        <div>מחיר למפגש:</div>
                                        <div>תאריך הפגישה:</div>
                                        <div>שעת הפגישה:</div>
                                        <div>הערות:</div>
                                    </div>
                                    <div>
                                        <div>{servicesState[serviceId].serviceName}</div>
                                        <div>{servicesState[serviceId].serviceDescription}</div>
                                        <div>{servicesState[serviceId].durationMinutes}</div>
                                        <div>{servicesState[serviceId].price}</div>
                                        <div><input
                                            type="date"
                                            value={meetingDate.toISOString().split('T')[0]}
                                            onChange={(e) => setMeetingDate(new Date(e.target.value))}
                                            required
                                        /></div>
                                        <div><input className={meetDateIsNotValid ? "meet-date-invalid" : ""}
                                            type="time"
                                            value={`${String(meetingDate.getHours()).padStart(2, '0')}:${String(meetingDate.getMinutes()).padStart(2, '0')}`}
                                            onChange={(e) => {
                                                const [hours, minutes] = e.target.value.split(":").map(Number);
                                                const newDate = new Date(meetingDate);
                                                newDate.setHours(hours);
                                                newDate.setMinutes(minutes);
                                                setMeetingDate(newDate);
                                            }}
                                            required
                                        /></div>
                                        <div><input
                                            type="text"
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                        /></div>
                                    </div>
                                </div>
                            </DialogContent>
                            <DialogActions style={{ direction: "rtl" }}>
                                <Button autoFocus onClick={handleClose} style={{ fontSize: "25px", fontWeight: "bold" }}>ביטול</Button>
                                <Button onClick={() => createMeeting()} style={{ fontSize: "25px", fontWeight: "bold" }}>שליחה</Button>
                            </DialogActions>
                        </Dialog>
                    </React.Fragment>
                    </div>
                ))}
        </div >
        </>
    )
}

export default businessDetails