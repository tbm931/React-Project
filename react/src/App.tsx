import { Link, Outlet } from 'react-router-dom';
import './App.css';
import { Card, CardHeader } from '@mui/material';

const linkStyle = {
  padding: "8px 16px",
  border: "1px solid #1976d2",
  borderRadius: "6px",
  color: "#1976d2",
  textDecoration: "none",
  fontWeight: "bold",
  transition: "0.2s",
  width: "150px",
};

const App = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <Card sx={{ direction: "rtl", width: "100%", boxShadow: 2, marginLeft: "2.5%" }}>
        <CardHeader
          title="ברוכים הבאים"
          subheader={
            <div style={{
              width: '100%',
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              flexWrap: "wrap",
              marginTop: "10px"
            }}>
              <Link to="/bossEnter" style={linkStyle}>כניסת מנהל</Link>
              <Link to="/customer" style={linkStyle}>כניסת לקוחות</Link>
              <Link to="/signUp" style={linkStyle}>הרשמה</Link>
            </div>
          }
        />
      </Card>

      <div style={{ padding: "20px", direction: "rtl", width: "100%", flexGrow: 1}}>
        <Outlet />
      </div>
    </div>
  );
};

export default App;