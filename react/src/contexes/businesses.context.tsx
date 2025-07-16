import { createContext, useEffect, useState } from "react";
import { getBusinesses } from "../APIsRequests/Business";
import type { businessDetails } from "../Types";

type BusinessesContextType = {
    businesses: businessDetails[];
    getBusinessesContext: () => Promise<businessDetails[]>;
};

export const BusinessContext = createContext<Partial<BusinessesContextType>>({});

export const BusinessesProvider = ({ children }: { children: React.ReactNode }) => {
    const [businesses, setBusinesses] = useState<businessDetails[]>([]);
    // const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBusinesses = async () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    const data = await getBusinesses();
                    setBusinesses(data);
                }
                } catch (error) {
                    console.error("Failed to load businesses:", error);
                } finally {
                    // setLoading(false);
                }
            };

            fetchBusinesses();
        }, []);

    const getBusinessesContext = async () => {
        const data = await getBusinesses();
        console.log(data);

        setBusinesses(data);
        return data;
    };

    if (businesses === undefined) return <div>טוען עסקים...</div>;

    return (
        <BusinessContext.Provider value={{ businesses, getBusinessesContext }}>
            {children}
        </BusinessContext.Provider>
    );
};