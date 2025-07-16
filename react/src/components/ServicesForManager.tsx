import { useContext, useEffect, useState } from "react";
import type { Business, Service } from "../Types"
import { ServiceContext } from "../contexes/services.context";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';
import PaperComponent from "./Paper";

const ServicesDetailsForManager = () => {
    const { services, updateServiceContext } = useContext(ServiceContext);
    const [loading, setLoading] = useState(true);
    const [enableService, setEnableService] = useState<boolean[]>([]);
    const [servicesState, setServicesState] = useState<Service[]>([]);
    let business: Business = JSON.parse(window.localStorage.getItem("business")!);
    const bName = business.businessName;
    const [open, setOpen] = React.useState(false);
    const { addServiceContext } = useContext(ServiceContext);
    const [showAllServices, setShowAllServices] = useState<boolean>(false);
    const [serviceChoosed, setServiceChoosed] = useState<boolean>(false);
    const [serviceIndex, setServiceIndex] = useState<number>(0);
    const [selectedValue, setSelectedValue] = useState<string>("");
    const [service, setService] = useState<Service>({
        businessId: 0,
        durationMinutes: 1,
        id: 0,
        isActive: true,
        price: 1,
        serviceDescription: "",
        serviceName: ""
    });
    const [formData, setFormData] = useState<Service>({
        businessId: JSON.parse(window.localStorage.getItem("business")!).businessId,
        durationMinutes: 1,
        id: 0,
        isActive: true,
        price: 1,
        serviceDescription: "",
        serviceName: ""
    });

    const handleChangeAddService = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = async (toSave: boolean) => {
        setOpen(false);
        if (toSave)
            await addServiceContext!(formData, JSON.parse(window.localStorage.getItem("business")!).businessName);
        setFormData({
            businessId: JSON.parse(window.localStorage.getItem("business")!).businessId,
            durationMinutes: 1,
            id: 0,
            isActive: true,
            price: 1,
            serviceDescription: "",
            serviceName: ""
        })
    };
    useEffect(() => {
        const fetchData = async () => {
            setServicesState(services!);
            setEnableService(Array(services!.length).fill(false));
            setLoading(false);
        }
        fetchData();
    }, [services]);

    const updateService = async (index: number) => {
        const serviceToUpdate = servicesState[index];
        await updateServiceContext!(serviceToUpdate, bName);

        const updatedEnable = [...enableService];
        updatedEnable[index] = false;
        setEnableService(updatedEnable);
    };
    const handleChange = (index: number, field: keyof Service, value: any) => {
        const updated = [...servicesState];
        updated[index] = {
            ...updated[index],
            [field]: value,
        };
        setServicesState(updated);

        const enabled = [...enableService];
        enabled[index] = true;
        setEnableService(enabled);
    };
    if (loading)
        return <>Loading...</>
    return (
        <>
            <button onClick={(e) => {
                setServiceChoosed(false);
                setServiceIndex(0);
                setService({
                    businessId: 0,
                    durationMinutes: 1,
                    id: 0,
                    isActive: true,
                    price: 1,
                    serviceDescription: "",
                    serviceName: ""
                });
                const button = e.target as HTMLButtonElement;
                setShowAllServices(!showAllServices);
                if (showAllServices)
                    button.value = "להסתרת כל השרותים";
                else
                    button.value = "להצגת כל השרותים";
            }}>להצגת כל השירותים</button><br />
            <select style={{marginTop: "20px",marginBottom: "20px"}}
                value={selectedValue}
                onChange={(e) => {
                    const selectedServiceId = Number(e.target.value);
                    setSelectedValue(e.target.value);
                    setShowAllServices(false);

                    const selectedIndex = servicesState.findIndex(service => service.id === selectedServiceId);
                    if (selectedIndex >= 0) {
                        setService(servicesState[selectedIndex]);
                        setServiceIndex(selectedIndex);
                        setServiceChoosed(true);
                    }
                }}
            >
                <option value="" disabled>בחר שירות להצגה</option>
                {servicesState.map((service: Service) => (
                    <option key={service.id} value={service.id}>
                        {service.serviceName}
                    </option>
                ))}
            </select>
            {serviceChoosed &&
                <div key={serviceIndex} style={{ border: "1px solid gray", width: "200px", height: "300px", paddingTop: "1%",marginRight:"43%", }}>
                    שם: <input
                        type="text"
                        value={service.serviceName}
                        onChange={(e) => handleChange(serviceIndex, 'serviceName', e.target.value)}
                    /><br />
                    תאור:
                    <input
                        type="text"
                        value={service.serviceDescription}
                        onChange={(e) => { handleChange(serviceIndex, 'serviceDescription', e.target.value); }}
                        title={service.serviceDescription} // Tooltip בהובר
                        style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                    /><br />
                    אורך הפגישה בדקות:<br /> <input
                        type="number"
                        value={service.durationMinutes}
                        onChange={(e) => handleChange(serviceIndex, 'durationMinutes', Number(e.target.value))}
                        style={{ width: "40px" }}
                    /><br />
                    מחיר:<br /> <input
                        type="number"
                        value={service.price}
                        onChange={(e) => handleChange(serviceIndex, 'price', Number(e.target.value))}
                        style={{ width: "40px" }}
                    /><br />
                    האם פעיל: <input
                        type="checkbox"
                        checked={service.isActive}
                        onChange={(e) => handleChange(serviceIndex, 'isActive', e.target.checked)}
                    /><br />
                    <button
                        disabled={!enableService[serviceIndex]}
                        onClick={() => updateService(serviceIndex)}
                    >
                        לשמירת השינויים
                    </button>
                </div>
            }
            {showAllServices && <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                {servicesState.map((service: Service, index: number) => (
                    <div key={index} style={{ border: "1px solid gray", width: "200px", height: "300px", paddingTop: "1%" }}>
                        שם: <input
                            type="text"
                            value={service.serviceName}
                            onChange={(e) => handleChange(index, 'serviceName', e.target.value)}
                        /><br />
                        תאור:
                        <input
                            type="text"
                            value={service.serviceDescription}
                            onChange={(e) => { handleChange(index, 'serviceDescription', e.target.value); }}
                            title={service.serviceDescription} // Tooltip בהובר
                            style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                        /><br />
                        אורך הפגישה בדקות:<br /> <input
                            type="number"
                            value={service.durationMinutes}
                            onChange={(e) => handleChange(index, 'durationMinutes', Number(e.target.value))}
                            style={{ width: "40px" }}
                        /><br />
                        מחיר:<br /> <input
                            type="number"
                            value={service.price}
                            onChange={(e) => handleChange(index, 'price', Number(e.target.value))}
                            style={{ width: "40px" }}
                        /><br />
                        האם פעיל: <input
                            type="checkbox"
                            checked={service.isActive}
                            onChange={(e) => handleChange(index, 'isActive', e.target.checked)}
                        /><br />
                        <button
                            disabled={!enableService[index]}
                            onClick={() => updateService(index)}
                        >
                            לשמירת השינויים
                        </button>
                    </div>
                ))}
            </div>}
            <br />
            <React.Fragment>
                <Button variant="outlined" onClick={handleClickOpen}>
                    +
                </Button>
                <Dialog
                    open={open}
                    onClose={() => handleClose(false)}
                    PaperComponent={PaperComponent}
                >
                    <DialogTitle style={{ cursor: 'move', direction: "rtl" }} >
                        הוספת שרות חדש
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText component="div" style={{ display: "flex", justifyContent: "space-between", direction: "rtl" }}>
                            <div>
                                שם:<br />
                                תיאור:<br />
                                האם השרות פעיל:<br />
                                מחיר:<br />
                                אורך השירות בדקות:<br />
                            </div>
                            <div>
                                <input type="text" name="serviceName" value={formData.serviceName} onChange={handleChangeAddService} required maxLength={50} /><br />
                                <input type="text" name="serviceDescription" value={formData.serviceDescription} onChange={handleChangeAddService} required maxLength={255} /><br />
                                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChangeAddService} required /><br />
                                <input type="number" name="price" value={formData.price} onChange={handleChangeAddService} min={1} required style={{ width: "40px " }} max={1000} /><br />
                                <input type="number" name="durationMinutes" value={formData.durationMinutes} onChange={handleChangeAddService} min={1} required style={{ width: "40px " }} max={120} /><br />
                            </div>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions style={{ direction: "rtl" }}>
                        <Button autoFocus onClick={() => handleClose(false)}>ביטול</Button>
                        <Button onClick={() => handleClose(true)}>שליחה</Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
            <br />
        </>
    )
}

export default ServicesDetailsForManager