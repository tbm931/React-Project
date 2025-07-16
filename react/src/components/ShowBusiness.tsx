import { Link } from "react-router-dom"

const ShowBusiness = () => {
    return (
        <>
        <br />
        <br />
        <br />
        <br />
        <br />
            <Link to="/managerEntered/businessDetails"><h2>פרטי העסק</h2></Link><br />
            <Link to="/managerEntered/servicesDetails"><h2>פרטי שירותים</h2></Link><br />
            <Link to="/managerEntered/meetingsList"><h2>רשימת פגישות</h2></Link><br />
        </>
    )
}

export default ShowBusiness