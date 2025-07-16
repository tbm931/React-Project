import { createContext, useEffect, useState } from "react";
import { type Service } from "../Types";
import { getServices, getServicesById, postService, putService } from "../APIsRequests/Services";

type ServicessContextType = {
    services: Service[],
    addServiceContext: (newService: Service, businessName: String) => Promise<void>,
    updateServiceContext: (updateService: Service, businessName: String) => Promise<void>,
    getServicesContext: () => Promise<void>
    getServicesByIdContext: (id: number) => Promise<void>
}


export const ServiceContext = createContext<Partial<ServicessContextType>>({});

export const ServicesProvider = ({ children }: { children: React.ReactNode }) => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    const data = await getServices();
                    setServices(data);
                }
            } catch (error) {
                console.error("Failed to load services:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const contextValue: ServicessContextType = {
        services: services,
        addServiceContext: async (newService: Service, businessName: String) => {
            const updated = [...services, newService];
            setServices(updated);
            await postService(newService, businessName);
        },
        updateServiceContext: async (updateService: Service, businessName: String) => {
            const newServices = services!.map((service: Service) => service.serviceName === updateService.serviceName ? updateService : service);
            setServices(newServices);
            await putService(updateService, businessName);
        },
        getServicesContext: async () => {
            const newservices =  await getServices();
            setServices(newservices);
        },
        getServicesByIdContext: async (id: number) => {
            const newservices =  await getServicesById(id);
            setServices(newservices); 
        }
    }

    if (loading) return <div>טוען שירותים...</div>;

    return <ServiceContext.Provider value={contextValue}>
        {children}
    </ServiceContext.Provider>
}