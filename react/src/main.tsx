import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MeetingsList from './components/MeetingsList';
import BusinessDetailsForManager from './components/BusinessDetailsForManager';
import BusinessDetails from './components/BusinessDetailsForCustomer';
import Manager from './components/Manager';
import Customer from './components/Customer';
import ShowBusiness from './components/ShowBusiness';
import { ServicesProvider } from './contexes/services.context';
import { MeetingsProvider } from './contexes/meetings.context';
import SignUp from './components/SignUp';
import LogInCustomer from './components/LogInCustomer';
import { BusinessesProvider } from './contexes/businesses.context';
import { ClientsProvider } from './contexes/clients.context';
import ServicesDetailsForManager from './components/ServicesForManager';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ClientsProvider>
        <BusinessesProvider>
          <ServicesProvider>
            <MeetingsProvider>
              <Routes>
                <Route path="/" element={<App />}>
                  <Route path="managerEntered/businessDetails" element={<BusinessDetailsForManager />} />
                  <Route path="managerEntered/servicesDetails" element={<ServicesDetailsForManager />} />
                  <Route path="managerEntered/meetingsList" element={<MeetingsList />} />
                  <Route path="bossEnter" element={<Manager />} />
                  <Route path="managerEntered" element={<ShowBusiness />} />
                  <Route path="customerEnter" element={<Customer />} />
                  <Route path="customer" element={<LogInCustomer />} />
                  <Route path="business/:id" element={<BusinessDetails />} />
                  <Route path="signUp" element={<SignUp />} />
                </Route>
              </Routes>
            </MeetingsProvider>
          </ServicesProvider>
        </BusinessesProvider>
      </ClientsProvider>
    </BrowserRouter>
  </StrictMode >,
)