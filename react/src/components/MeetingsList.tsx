import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useContext, useEffect, useState } from "react";
import { Status, type Meeting } from "../Types";
import { MeetingContext } from "../contexes/meetings.context";
import { ClientContext } from "../contexes/clients.context";
import { ServiceContext } from "../contexes/services.context";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import MoreVertSharpIcon from '@mui/icons-material/MoreVertSharp';

const options = [Status.Canceled, Status.Completed, Status.Scheduled];
const paginationModel = { page: 0, pageSize: 5 };
type ConfirmationDialogRawProps = {
    open: boolean;
    value: Status;
    onClose: (value?: Status) => void;
};

const ConfirmationDialogRaw = ({ open, value: valueProp, onClose }: ConfirmationDialogRawProps) => {
    const [value, setValue] = useState<Status>(valueProp);

    useEffect(() => {
        if (!open) {
            setValue(valueProp);
        }
    }, [valueProp, open]);

    const handleOk = () => onClose(value);
    const handleCancel = () => onClose();
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value as Status);
    };
    const statusLabels: Record<Status, string> = {
        [Status.Scheduled]: "נקבעה",
        [Status.Completed]: "הושלמה",
        [Status.Canceled]: "מבוטלת"
    };
    return (
        <Dialog open={open}>
            <DialogTitle>בחר סטטוס חדש</DialogTitle>
            <DialogContent>
                <RadioGroup style={{ direction: "rtl" }} value={value} onChange={handleChange}>
                    {options.map(option => (
                        <FormControlLabel
                            key={option}
                            value={option}
                            control={<Radio />}
                            label={statusLabels[option]}
                        />
                    ))}
                </RadioGroup>
            </DialogContent>
            <DialogActions style={{ direction: "rtl" }}>
                <Button onClick={handleCancel}>ביטול</Button>
                <Button onClick={handleOk}>אישור</Button>
            </DialogActions>
        </Dialog>
    );
};

type Row = {
    id: number;
    serviceId?: number;
    MeetingID: string;
    MeetingName: string;
    Date: Date;
    Hour: string;
    clientId: Number;
    ScheduledAt: Date;
    DisplayDate: string;
    DurationMinutes: number;
    Status: Status;
    MeetingNotes: string;
    PricePerMeeting: number;
    ClientID: string;
    ClientName: string;
    Age: number;
    Phone: string;
    Email: string;
    ClientNotes: string;
};

const MeetingList = () => {
    const { meetings, updateMeeting, loading: meetingsLoading } = useContext(MeetingContext);
    const { clients } = useContext(ClientContext);
    const { services } = useContext(ServiceContext);
    const [rows, setRows] = useState<Row[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
    const [dialogValue, setDialogValue] = useState<Status>(Status.Scheduled);
    const isLoading = meetingsLoading || !clients?.length || !services?.length;

    console.log("meetings:", meetings);
    console.log("clients:", clients);
    console.log("services:", services);
    console.log("meetingsLoading:", meetingsLoading);

    useEffect(() => {
        if (isLoading || !meetings?.length) return;

        const buildRows: Row[] = meetings
            .sort((a, b) => new Date(a.meetingDate).getTime() - new Date(b.meetingDate).getTime())
            .map((meeting, index) => {
                const client = clients.find(c => c.id === meeting.clientId)!;
                const service = services.find(s => s.id === meeting.serviceId)!;

                return {
                    id: index,
                    serviceId: service.id,
                    clientId: client.id,
                    MeetingID: meeting.id.toString(),
                    MeetingName: service.serviceName,
                    Date: new Date(meeting.meetingDate),
                    Hour: new Date(meeting.meetingDate).toLocaleTimeString('he-IL', {
                        timeZone: "Asia/Jerusalem",
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    ScheduledAt: meeting.scheduledAt,
                    DisplayDate: new Date(meeting.meetingDate).toLocaleDateString('he-IL', {
                        timeZone: "Asia/Jerusalem"
                    }),
                    DurationMinutes: service.durationMinutes,
                    Status: meeting.meetingStatus,
                    MeetingNotes: meeting.notes,
                    PricePerMeeting: service.price,
                    ClientID: client.idNumber,
                    ClientName: client.clientName,
                    Age: new Date().getFullYear() - new Date(client.birthDate).getFullYear(),
                    Phone: client.phone,
                    Email: client.email,
                    ClientNotes: client.notes,
                };
            });

        setRows(buildRows);
    }, [meetings, clients, services, isLoading]);

    const handleDialogOpen = (id: number, currentStatus: Status) => {
        setSelectedRowId(id);
        setDialogValue(currentStatus);
        setOpenDialog(true);
    };

    const getTypeMeeting = (date: Date, status: Status): 'red' | 'orange' | 'green' | 'gray' | 'yellow' => {
        const msInDay = 1000 * 60 * 60 * 24;
        const diffInMs = date.getTime() - new Date().getTime();
        const diffInDays = Math.floor(diffInMs / msInDay);
        if (status === Status.Canceled) return 'gray';
        if (status === Status.Completed || diffInDays < 0) return 'yellow';
        if (diffInDays === 0) return 'red';
        if (diffInDays <= 7) return 'orange';
        return 'green';
    }

    const handleDialogClose = async (newValue?: Status) => {
        if (selectedRowId != null && newValue) {
            let updated: Meeting | undefined;

            const updatedRows = rows.map((row) => {
                if (row.id === selectedRowId && row.Date > new Date()) {
                    const updatedRow = { ...row, Status: newValue };
                    updated = {
                        ...updatedRow,
                        meetingStatus: newValue,
                        meetingDate: row.Date,
                        serviceId: Number(row.serviceId),
                        clientId: Number(row.clientId),
                        notes: row.MeetingNotes,
                        id: Number(row.MeetingID),
                        scheduledAt: row.ScheduledAt,
                    };
                    return updatedRow;
                }
                return row;
            });

            setRows(updatedRows);

            if (updated) {
                await updateMeeting!(updated);
            }
        }

        setOpenDialog(false);
    };

    const columns: GridColDef[] = [
        {
            field: 'MeetingID', headerName: "מס'", width: 20, renderCell: (params) => (
                <div dir="rtl" style={{ width: '100%', textAlign: 'right' }}>
                    {params.value}
                </div>
            )
        },
        {
            field: 'MeetingName', headerName: 'שם הפגישה', width: 150, renderCell: (params) => (
                <div dir="rtl" style={{ width: '100%', textAlign: 'right' }}>
                    {params.value}
                </div>
            )
        },
        {
            field: 'DisplayDate', headerName: 'תאריך', width: 100, renderCell: (params) => (
                <div dir="rtl" style={{ width: '100%', textAlign: 'right' }}>
                    {params.value}
                </div>
            )
        },
        { field: 'Hour', headerName: 'שעה', width: 70 },
        { field: 'DurationMinutes', headerName: 'משך זמן', width: 80 },
        {
            field: 'Status',
            headerName: 'סטטוס',
            width: 150,
            renderCell: (params) => {
                const statusHebrew = params.value === Status.Scheduled
                    ? "נקבעה"
                    : params.value === Status.Completed
                        ? "הושלמה"
                        : "מבוטלת";

                return (
                    <Box display="flex" alignItems="center" gap={1}>
                        <span>{statusHebrew}</span>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleDialogOpen(params.row.id, params.value)}
                            disabled={!(params.row.Date > new Date())}
                        >
                            <MoreVertSharpIcon />
                        </Button>
                    </Box>
                );
            }
        },
        {
            field: 'MeetingNotes',
            headerName: 'הערות',
            width: 150,
            renderCell: (params) => (
                <div
                    dir="rtl"
                    title={params.value}
                    style={{
                        width: '100%',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        textAlign: 'right'
                    }}
                >
                    {params.value}
                </div>
            )
        },
        {
            field: 'PricePerMeeting', headerName: 'מחיר', width: 80, renderCell: (params) => (
                <div dir="rtl" style={{ width: '100%', textAlign: 'right' }}>
                    {params.value}
                </div>
            )
        },
        {
            field: 'ClientName', headerName: 'לקוח', width: 120, renderCell: (params) => (
                <div dir="rtl" style={{ width: '100%', textAlign: 'right' }}>
                    {params.value}
                </div>
            )
        },
        {
            field: 'Age', headerName: 'גיל', width: 60, renderCell: (params) => (
                <div dir="rtl" style={{ width: '100%', textAlign: 'right' }}>
                    {params.value}
                </div>
            )
        },
        { field: 'Phone', headerName: 'טלפון', width: 120 },
        { field: 'Email', headerName: 'מייל', width: 150 },
        {
            field: 'ClientNotes',
            headerName: 'הערות לקוח',
            width: 150,
            renderCell: (params) => (
                <div
                    dir="rtl"
                    title={params.value}
                    style={{
                        width: '100%',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        textAlign: 'right'
                    }}
                >
                    {params.value}
                </div>
            )
        }
    ];

    // return (
    //     <Paper sx={{ height: 500, width: '100%', direction: "rtl",overflowX: "auto" }}>
    //         <DataGrid style={{ direction: "rtl" }} rows={rows} columns={columns} getRowClassName={(params) => {
    //             const row = params.row as Row;
    //             const colorType = getTypeMeeting(row.Date, row.Status);
    //             return `row-${colorType}`;
    //         }} initialState={{ pagination: { paginationModel } }}
    //             pageSizeOptions={[5, 7, 10, 15, 20]}
    //             checkboxSelection />
    //         <ConfirmationDialogRaw open={openDialog} value={dialogValue} onClose={handleDialogClose} />
    //     </Paper>
    // );
    if (isLoading) {
        return <div>טוען נתונים...</div>
    };

    return (
        <div style={{ width: '100%', overflowX: 'auto' }}>
            <div style={{ minWidth: 1200 }}>
                <Paper sx={{ height: 500, width: '100%', direction: "rtl" }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        style={{ direction: 'rtl' }}
                        getRowClassName={(params) => {
                            const row = params.row as Row;
                            const colorType = getTypeMeeting(row.Date, row.Status);
                            return `row-${colorType}`;
                        }}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[5, 7, 10, 15, 20]}
                        checkboxSelection
                        hideFooterSelectedRowCount
                    />
                    <ConfirmationDialogRaw
                        open={openDialog}
                        value={dialogValue}
                        onClose={handleDialogClose}
                    />
                </Paper>
            </div>
        </div>
    );
};


export default MeetingList;