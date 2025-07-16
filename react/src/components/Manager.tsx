import { useContext, useState } from "react"
import { login } from "../APIsRequests/Sign";
import type { SigninResponse } from "../Types";
import { MeetingContext } from "../contexes/meetings.context";
import { ServiceContext } from "../contexes/services.context";
import { useNavigate } from "react-router-dom";
import { ClientContext } from "../contexes/clients.context";

const inputStyle = {
    height: "25px"
}

const Manager = () => {
    const { getMeetingsToManager } = useContext(MeetingContext);
    const { getServicesContext } = useContext(ServiceContext);
    const { getClientsContext } = useContext(ClientContext);
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
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
            window.localStorage.setItem("user", JSON.stringify(response.user));
            window.localStorage.setItem("business", JSON.stringify(response.business));
            window.localStorage.setItem("client", "");
            await getMeetingsToManager!();
            await getClientsContext!();
            await getServicesContext!();
            navigate("/managerEntered");
        }
    }
    return (
        <>
            <form onSubmit={clicked} style={{ border: "solid 3px rgba(0, 0, 0, 0.415)", borderRadius: "12px", width: "250px", height: "200px", marginTop: "5%", paddingTop: "5%", marginRight: "40%" }}>
                <input style={inputStyle} type="text" placeholder="שם משתמש" onChange={(e) => setName(e.target.value)} /><br /><br />
                <input style={inputStyle} type="password" placeholder="סיסמא" onChange={(e) => setPassword(e.target.value)} /><br /><br />
                <button type="submit">כניסה</button>
            </form>
        </>
    )
}

export default Manager