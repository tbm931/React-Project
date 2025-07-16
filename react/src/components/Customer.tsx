import { useContext } from "react";
import { BusinessContext } from "../contexes/businesses.context";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
// import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { Tooltip } from "@mui/material";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: (theme.vars ?? theme).palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));
const Customer = () => {
    const { businesses } = useContext(BusinessContext);
    if (!businesses) {
        return <div>טוען נתונים...</div>;
    }

    return (
        <>
            <h3>בחר עסק:</h3>
            <div style={{
                display: 'flex',
                justifyContent: "space-around",
                flexWrap: "wrap",
            }}>                {businesses.map((business) => (
                <Link to={`../business/${business.id}`} key={business.id.toString()} style={{ marginTop: "5%", width: "300px", display: "inline-block" }}>
                    <Grid container>
                        <Item>
                            <h3>{business.businessName}</h3>
                            <Tooltip title={<span dir="rtl">{business.details}</span>}>
                                <div
                                    style={{
                                        display: "-webkit-box",
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        direction: "rtl",
                                        height: "60px",
                                        textAlign: "center"
                                    }}
                                >
                                    {business.details}
                                </div>
                            </Tooltip>
                            <p>{business.email}</p>
                            <p>{business.phone}</p>
                            <p>{business.businessAddress}</p>
                        </Item>
                    </Grid>
                </Link>
            ))}
            </div>
        </>
    )
}

export default Customer