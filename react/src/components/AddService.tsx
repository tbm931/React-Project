// import { useContext, useState } from "react";
// import { type Service } from "../Types";
// import { ServiceContext } from "../contexes/services.context";

// const AddService = () => {
//     const { addServiceContext } = useContext(ServiceContext);
//     const [formData, setFormData] = useState<Service>({
//         businessId: JSON.parse(window.localStorage.getItem("business")!).businessId,
//         durationMinutes: 0,
//         id: 0,
//         isActive: true,
//         price: 0,
//         serviceDescription: "",
//         serviceName: ""
//     });

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value, type, checked } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: type === 'checkbox' ? checked : value
//         }));
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         addServiceContext!(formData, JSON.parse(window.localStorage.getItem("business")!).businessName);
//     };

//     return (
//         <form onSubmit={handleSubmit} style={{ border: "1px solid red", width: "200px", height: "300px", paddingTop: "1%", marginRight: "35%" }}>
//             שם: <input type="text" name="serviceName" value={formData.serviceName} onChange={handleChange} /><br />
//             תיאור: <input type="text" name="serviceDescription" value={formData.serviceDescription} onChange={handleChange} /><br />
//             האם השרות פעיל: <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} /><br />
//             מחיר: <input type="number" name="price" value={formData.price} onChange={handleChange} /><br />
//             אורך השירות בדקות: <input type="number" name="durationMinutes" value={formData.durationMinutes} onChange={handleChange} /><br />
//             <button type="submit">שלח</button>
//         </form>
//     );
// };
// export default AddService


import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper, { type PaperProps } from '@mui/material/Paper';
import Draggable from 'react-draggable';
import { useContext, useState } from 'react';
import React from 'react';
import { ServiceContext } from '../contexes/services.context';
import type { Service } from '../Types';

function PaperComponent(props: PaperProps) {
    const nodeRef = React.useRef<HTMLDivElement>(null);
    return (
        <Draggable
            nodeRef={nodeRef as React.RefObject<HTMLDivElement>}
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} ref={nodeRef} />
        </Draggable>
    );
}

const AddService = () => {
    const [open, setOpen] = React.useState(false);
    const { addServiceContext } = useContext(ServiceContext);
    const [formData, setFormData] = useState<Service>({
        businessId: JSON.parse(window.localStorage.getItem("business")!).businessId,
        durationMinutes: 0,
        id: 0,
        isActive: true,
        price: 0,
        serviceDescription: "",
        serviceName: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = async (e: any) => {
        setOpen(false);
        e.preventDefault();
        await addServiceContext!(formData,JSON.parse(window.localStorage.getItem("business")!).businessName);
    };

    // const handleSubmit = (e: React.FormEvent) => {
    //     e.preventDefault();
    //     addServiceContext!(formData, JSON.parse(window.localStorage.getItem("business")!).businessName);
    // };

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                +
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperComponent={PaperComponent}
            // aria-labelledby="draggable-dialog-title"
            >
                {/* <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title"> */}
                <DialogTitle style={{ cursor: 'move' }} >
                    Add Service
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                            שם: <input type="text" name="serviceName" value={formData.serviceName} onChange={handleChange} /><br />
                            תיאור: <input type="text" name="serviceDescription" value={formData.serviceDescription} onChange={handleChange} /><br />
                            האם השרות פעיל: <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} /><br />
                            מחיר: <input type="number" name="price" value={formData.price} onChange={handleChange} /><br />
                            אורך השירות בדקות: <input type="number" name="durationMinutes" value={formData.durationMinutes} onChange={handleChange} /><br />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleClose}>send</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default AddService