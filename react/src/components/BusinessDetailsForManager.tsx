import { useState } from "react";
import { putBusiness } from "../APIsRequests/Business"
import type { Business } from "../Types"

const inputStyle: React.CSSProperties  = {
    height: "32px",
    width: "100%",
    boxSizing: "border-box",
    padding: "4px 8px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  };

const BusinessDetailsForManager = () => {
    const [enableBusiness, setEnableBusiness] = useState<boolean>(false);
    let business: Business = JSON.parse(window.localStorage.getItem("business")!);
    const [bName, setBName] = useState(business.businessName);
    const [address, setAddress] = useState(business.businessAddress);
    const [email, setEmail] = useState(business.email);
    const [phone, setPhone] = useState(business.phone);
    const [details, setDetails] = useState(business.details);

    const saveDetails = async () => {
        const newbusiness: Business = { businessAddress: address, businessName: bName, details: details, email: email, id: business.id, phone: phone, userId: business.userId };
        await putBusiness(newbusiness);
        setEnableBusiness(false);
        window.localStorage.setItem("business", JSON.stringify(newbusiness));
    }

    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h2>פרטי העסק</h2>
                <div style={{ display: "grid", gridTemplateColumns: "150px 300px", gap: "12px 20px", textAlign: "right", direction: "rtl" }}>
                    <label>שם העסק</label>
                    <input type="text" value={bName} onChange={(e) => { setBName(e.target.value); setEnableBusiness(true); }} style={inputStyle} />

                    <label>כתובת העסק</label>
                    <input type="text" value={address} onChange={(e) => { setAddress(e.target.value); setEnableBusiness(true); }} style={inputStyle} />

                    <label>מייל</label>
                    <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setEnableBusiness(true); }} style={inputStyle} />

                    <label>טלפון</label>
                    <input type="tel" value={phone} onChange={(e) => { setPhone(e.target.value); setEnableBusiness(true); }} style={inputStyle} />

                    <label>פרטים</label>
                    <input
                        type="text"
                        value={details}
                        onChange={(e) => { setDetails(e.target.value); setEnableBusiness(true); }}
                        title={details} // Tooltip בהובר
                        style={{ ...inputStyle, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                    />
                </div>
                <br />
                <button disabled={!enableBusiness} onClick={() => saveDetails()} style={{ marginTop: "16px" }}>
                    לשמירת השינויים
                </button>
            </div>
        </>
    )
}

export default BusinessDetailsForManager