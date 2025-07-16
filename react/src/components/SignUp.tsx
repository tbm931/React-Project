import { useState } from "react";
import { login, signUp } from "../APIsRequests/Sign";
import type { ClientWithoutId, userForSignUp } from "../Types";

const SignUp = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [idNumber, setIdNumber] = useState("");
    const [user, setUser] = useState<'' | 'client' | 'user'>('');
    const [birthDate, setBirthDate] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [notes, setNotes] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [businessAddress, setBusinessAddress] = useState("");
    const [selectedValue, setSelectedValue] = useState<string>("");

    const Enter = async () => {
        if (user === '') {
            alert("אנא בחר סוג משתמש");
            return;
        }

        let userOrClient: userForSignUp | ClientWithoutId;

        if (user === 'user') {
            userOrClient = {
                newUser: {
                    idNumber,
                    pw: password,
                    userName: name
                },
                newBusiness: {
                    businessAddress,
                    businessName,
                    details: notes,
                    email,
                    phone,
                    userId: 0
                }
            };
        } else {
            userOrClient = {
                birthDate: new Date(birthDate),
                clientName: name,
                email,
                idNumber,
                notes,
                phone,
                pw: password
            };
        }

        const response = await signUp(userOrClient, user);
        if (response === 'Business and user saved successfully!' || response === "Client created successfully.") {
            alert("ההרשמה בוצעה בהצלחה");
            const res = await login(name, password);
            if (res.message === "success") {
                if (response === 'Business and user saved successfully!') {
                    localStorage.setItem("user", JSON.stringify(res.user));
                    if (res.business) {
                        localStorage.setItem("business", JSON.stringify(res.business));
                    }
                    localStorage.setItem("client", "");
                }
                else {
                    localStorage.setItem("user", "");
                    localStorage.setItem("business", "");
                    localStorage.setItem("client", JSON.stringify(res.user));
                }
                localStorage.setItem("token", res.token);
                localStorage.setItem("role", res.role);
                window.location.href = res.role === "client" ? "/customerEnter" : "/managerEntered";
            } else {
                alert("ההרשמה נכשלה, נסה שוב");
            }
        } else {
            alert("ההרשמה נכשלה, נסה שוב");
        }
    };

    const formatPhone = (raw: string) => {
        if (raw.length <= 3) return raw;
        return `${raw.slice(0, 3)}-${raw.slice(3)}`;
    };

    return (
        <div style={{
            border: "3px solid rgba(0, 0, 0, 0.415)",
            borderRadius: "12px",
            width: "350px",
            height: "520px",
            padding: "15px",
            marginRight: "35%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            lineHeight: "2.5",
        }}>
            <form style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <FormRow label="שם:">
                    <input type="text" onChange={(e) => setName(e.target.value)} required maxLength={20} />
                </FormRow>
                <FormRow label="סיסמא:">
                    <input type="password" onChange={(e) => setPassword(e.target.value)} required maxLength={10} minLength={6} />
                </FormRow>
                <FormRow label="ID:">
                    <input type="text" onChange={(e) => setIdNumber(e.target.value)} required minLength={9} maxLength={9} />
                </FormRow>
                <FormRow label="סוג משתמש:">
                    <select
                        style={{ width: "170px" }}
                        value={selectedValue}
                        onChange={(e) => {
                            const selected = e.target.value as 'client' | 'user';
                            setSelectedValue(selected);
                            setUser(selected);
                        }}
                        required
                    >
                        <option value="" disabled>סוג משתמש</option>
                        <option value="user">בעל עסק</option>
                        <option value="client">לקוח</option>
                    </select>
                </FormRow>

                {user === 'user' && (
                    <>
                        <FormRow label="שם העסק:">
                            <input type="text" onChange={(e) => setBusinessName(e.target.value)} required maxLength={50} />
                        </FormRow>
                        <FormRow label="כתובת העסק:">
                            <input type="text" onChange={(e) => setBusinessAddress(e.target.value)} required maxLength={50} />
                        </FormRow>
                        <FormRow label="טלפון:">
                            <input
                                type="tel"
                                value={formatPhone(phone)}
                                onChange={(e) => {
                                    const rawValue = e.target.value.replace(/[^0-9]/g, '');
                                    if (rawValue.length <= 10) setPhone(rawValue);
                                }}
                                pattern="[0-9]{3}-[0-9]{7}"
                                placeholder="000-0000000"
                                required
                            />
                        </FormRow>
                        <FormRow label="מייל:">
                            <input type="email" onChange={(e) => setEmail(e.target.value)} required />
                        </FormRow>
                        <FormRow label="פרטים:">
                            <input type="text" onChange={(e) => setNotes(e.target.value)} required maxLength={255} />
                        </FormRow>
                    </>
                )}

                {user === 'client' && (
                    <>
                        <FormRow label="תאריך לידה:">
                            <input type="date" onChange={(e) => setBirthDate(e.target.value)} style={{ width: "170px" }} required />
                        </FormRow>
                        {/* <FormRow label="טלפון:">
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace('-', ''))}
                                pattern="[0-9]{3}-[0-9]{7}"
                                placeholder="000-0000000"
                                required
                                minLength={11}
                                maxLength={11}
                            />
                        </FormRow> */}
                        <FormRow label="טלפון:">
                            <input
                                type="tel"
                                value={formatPhone(phone)}
                                onChange={(e) => {
                                    const rawValue = e.target.value.replace(/[^0-9]/g, '');
                                    if (rawValue.length <= 10) setPhone(rawValue);
                                }}
                                pattern="[0-9]{3}-[0-9]{7}"
                                placeholder="000-0000000"
                                required
                            />
                        </FormRow>
                        <FormRow label="מייל:">
                            <input type="email" onChange={(e) => setEmail(e.target.value)} required />
                        </FormRow>
                        <FormRow label="הערות:">
                            <input type="text" onChange={(e) => setNotes(e.target.value)} maxLength={255} />
                        </FormRow>
                    </>
                )}
            </form>

            <div style={{ textAlign: "center" }}>
                <button type="button" onClick={Enter}>כניסה</button>
            </div>
        </div>
    );
};

const FormRow = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "10px"
    }}>
        <label style={{ minWidth: "100px", textAlign: "right" }}>{label}</label>
        {children}
    </div>
);

export default SignUp;

{/* <InputMask
                                    mask="999-9999999"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                >
                                    <input type="tel" placeholder="000-0000000" required />
                                </InputMask> */}