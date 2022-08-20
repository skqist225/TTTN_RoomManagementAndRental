import React, { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

import './css/style.scss'

import './charts/ChartjsConfig'

// Import pages
import Dashboard from './pages/Dashboard'
import { AddRoomPage, AddUserPage, EditRoomPage, EditUserPage, RoomDetailsPage, UserDetailsPage, } from './pages'
import LoginPage from './pages/LoginPage'

function App() {
    const location = useLocation();

    useEffect(() => {
        document.querySelector("html").style.scrollBehavior = "auto";
        window.scroll({ top: 0 });
        document.querySelector("html").style.scrollBehavior = "";
    }, [location.pathname]); // triggered on route change

    return (
        <>
            <Routes>
                <Route exact path='/' element={<Dashboard />} />
                <Route path='/login' element={<LoginPage />} />

                <Route path='/rooms' element={<Dashboard />} />
                <Route path='/rooms/:roomid' element={<RoomDetailsPage />} />
                <Route path='/rooms/:roomid/edit' element={<EditRoomPage />} />
                <Route path='/add/room' element={<AddRoomPage />} />

                <Route path='/bookings' element={<Dashboard />} />
                <Route path='/bookings/overview' element={<Dashboard />} />
                <Route path='/bookings/details' element={<Dashboard />} />
                <Route path='/users' element={<Dashboard />} />
                <Route path='/users/:userid' element={<UserDetailsPage />} />
                <Route path='/add/user' element={<AddUserPage />} />
                <Route path='/edit/user/:userid' element={<EditUserPage />} />
                <Route path='/categories' element={<Dashboard />} />
                <Route path="/amenities" element={<Dashboard/>}/>
              <Route path="/amenities/categories" element={<Dashboard/>}/>
              <Route path="/rules" element={<Dashboard/>}/>
                <Route path='/privacies' element={<Dashboard />} />
            </Routes>
        </>
    );
}

export default App;
