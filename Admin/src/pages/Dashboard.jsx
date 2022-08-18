import React, { useEffect, useState } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import WelcomeBanner from "../partials/dashboard/WelcomeBanner";
import DashboardAvatars from "../partials/dashboard/DashboardAvatars";
import FilterButton from "../partials/actions/FilterButton";
import Datepicker from "../partials/actions/Datepicker";
import DashboardCard01 from "../partials/dashboard/DashboardCard01";
import DashboardCard02 from "../partials/dashboard/DashboardCard02";
import DashboardCard03 from "../partials/dashboard/DashboardCard03";
import DashboardCard04 from "../partials/dashboard/DashboardCard04";
import DashboardCard05 from "../partials/dashboard/DashboardCard05";
import DashboardCard06 from "../partials/dashboard/DashboardCard06";
import DashboardCard07 from "../partials/dashboard/DashboardCard07";
import DashboardCard08 from "../partials/dashboard/DashboardCard08";
import DashboardCard09 from "../partials/dashboard/DashboardCard09";
import DashboardCard10 from "../partials/dashboard/DashboardCard10";
import DashboardCard11 from "../partials/dashboard/DashboardCard11";
import DashboardCard12 from "../partials/dashboard/DashboardCard12";
import DashboardCard13 from "../partials/dashboard/DashboardCard13";
import { useDispatch, useSelector } from "react-redux";
import {
    RoomsPage,
    BookingDetailsPage,
    UsersPage,
    CategoriesPage,
    AmenitiesPage,
    RulesPage,
    PrivaciesPage,
    BookingsPage,
    BookingOverviewPage,
} from ".";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchRooms } from "../features/room/roomSlice";
import { fetchBookings } from "../features/booking/bookingSlice";
import { fetchUsers, userState } from "../features/user/userSlice";
import { fetchCategories } from "../features/category/categorySlice";
import { fetchAmenities, fetchAmenityCategories } from "../features/amenity/amenitySlice";
import { fetchRules } from "../features/rule/ruleSlice";
import { fetchPrivacies } from "../features/privacy/privacySlice";
import { authState } from "../features/auth/authSlice";
import { fetchBookingDetails } from "../features/bookingDetail/bookingDetailSlice";

function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const { pathname } = useLocation();
    const { user } = useSelector(userState);
    const {
        loginAction: { loading },
    } = useSelector(authState);

    useEffect(() => {
        console.log(pathname);
        switch (pathname) {
            case "/rooms": {
                dispatch(fetchRooms(1));
                break;
            }
            case "/categories": {
                dispatch(fetchCategories());
                break;
            }
            case "/amenities": {
                dispatch(fetchAmenities(1));
                dispatch(fetchAmenityCategories());
                break;
            }
            case "/rules": {
                dispatch(fetchRules(1));
                break;
            }
            case "/privacies": {
                dispatch(fetchPrivacies(1));
                break;
            }
            case "/users": {
                dispatch(fetchUsers(1));
                console.log("asd");
                break;
            }
            case "/bookings/details": {
                dispatch(fetchBookingDetails(1));
            }
        }
    }, [pathname]);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                // navigate("/login");
            }
        }
    }, [loading]);

    return (
        <div className='flex h-screen overflow-hidden'>
            {/* Sidebar */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Content area */}
            <div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden'>
                {/*  Site header */}
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <main>
                    <div className='px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto'>
                        {pathname === "/users" && (
                            <>
                                <UsersPage />
                            </>
                        )}
                        {pathname === "/rooms" && (
                            <>
                                <RoomsPage />
                            </>
                        )}
                        {pathname === "/bookings" && (
                            <>
                                <BookingsPage />
                            </>
                        )}
                        {pathname === "/bookings/details" && (
                            <>
                                <BookingDetailsPage />
                            </>
                        )}
                        {pathname === "/categories" && (
                            <>
                                <CategoriesPage />
                            </>
                        )}
                        {pathname === "/amenities" && (
                            <>
                                <AmenitiesPage />
                            </>
                        )}
                        {pathname === "/rules" && (
                            <>
                                <RulesPage />
                            </>
                        )}
                        {pathname === "/privacies" && (
                            <>
                                <PrivaciesPage />
                            </>
                        )}
                        {pathname === "/bookings/overview" && (
                            <>
                                <BookingOverviewPage />
                            </>
                        )}

                        {pathname === "/" && (
                            <>
                                {/* Welcome banner */}
                                <WelcomeBanner />

                                {/* Dashboard actions */}
                                <div className='sm:flex sm:justify-between sm:items-center mb-8'>
                                    {/* Left: Avatars */}
                                    {/* <DashboardAvatars />

                                    <div className='grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2'>
                                        <FilterButton />
                                        <Datepicker />
                                        <button className='btn bg-indigo-500 hover:bg-indigo-600 text-white'>
                                            <svg
                                                className='w-4 h-4 fill-current opacity-50 shrink-0'
                                                viewBox='0 0 16 16'
                                            >
                                                <path d='M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z' />
                                            </svg>
                                            <span className='hidden xs:block ml-2'>Add view</span>
                                        </button>
                                    </div> */}
                                </div>

                                {/* Cards */}
                                <div className='grid grid-cols-12 gap-6'>
                                    <DashboardCard01 />
                                    <DashboardCard02 />
                                    <DashboardCard03 />
                                    <DashboardCard04 />
                                    <DashboardCard05 />
                                    <DashboardCard06 />
                                    <DashboardCard07 />
                                    <DashboardCard08 />
                                    <DashboardCard09 />
                                    <DashboardCard10 />
                                    <DashboardCard11 />
                                    <DashboardCard12 />
                                    <DashboardCard13 />
                                </div>
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Dashboard;
