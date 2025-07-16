import { createContext, useEffect, useState } from "react";
import { type Client } from "../Types";
import { getClients } from "../APIsRequests/Clients";

type ClientsContextType = {
    clients: Client[],
    getClientsContext: () => Promise<Client[]>
}


export const ClientContext = createContext<Partial<ClientsContextType>>({});

export const ClientsProvider = ({ children }: { children: React.ReactNode }) => {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const token = localStorage.getItem("token");
                const role = localStorage.getItem("role");
                if (token && role === "user") {
                    const data = await getClients();
                    setClients(data);
                }
            } catch (error) {
                console.error("Failed to load clients:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, []);
    const getClientsContext = async () => {
        const data = await getClients();
        setClients(data);
        return data;
    }

    if (loading) return <div>טוען לקוחות...</div>;

    return <ClientContext.Provider value={{ clients, getClientsContext }}>
        {children}
    </ClientContext.Provider>
}