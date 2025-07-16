import { useContext, useState } from "react"
import { login } from "../APIsRequests/Sign";
import type { SigninResponse } from "../Types";
import { BusinessContext } from "../contexes/businesses.context";

const inputStyle = {
    height: "25px"
}

const LogInCustomer = () => {
    const { getBusinessesContext } = useContext(BusinessContext);
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const clicked = async (e: React.FormEvent) => {
        e.preventDefault();
        const response: SigninResponse = await login(name, password);
        if (response.message === "fail") {
            setName("");
            setPassword("");
            alert("שם משתמש או סיסמא שגויים");
        }
        else {
            window.localStorage.setItem("token", response.token);
            window.localStorage.setItem("role", response.role);
            window.localStorage.setItem("client", JSON.stringify(response.user));
            window.localStorage.setItem("user", "");
            window.localStorage.setItem("business", "");
            await getBusinessesContext!();
            window.location.href = "/customerEnter";
        }
    }
    return (
        <>
            <form onSubmit={clicked} style={{ border: "solid 3px rgba(0, 0, 0, 0.415)", borderRadius: "12px", width: "250px", height: "200px", marginTop: "5%", paddingTop: "5%", marginRight: "40%" }}>
                <input style={inputStyle} type="text" value={name} placeholder="שם משתמש" onChange={(e) => setName(e.target.value)} /><br /><br />
                <input style={inputStyle} type="password" value={password} placeholder="סיסמא" onChange={(e) => setPassword(e.target.value)} /><br /><br />
                <button type="submit">כניסה</button>
            </form>
        </>
    )
}

export default LogInCustomer