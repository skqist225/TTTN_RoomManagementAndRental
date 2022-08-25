import React, { useEffect, useState } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import WelcomeBanner from "../partials/dashboard/WelcomeBanner";
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
    AmenitiesPage,
    AmenityCategoriesPage,
    BookingDetailsPage,
    BookingOverviewPage,
    BookingsPage,
    CategoriesPage,
    PrivaciesPage,
    RoomsPage,
    RulesPage,
    UsersPage,
} from ".";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchRooms } from "../features/room/roomSlice";
import { fetchUsers, userState } from "../features/user/userSlice";
import { fetchCategories } from "../features/category/categorySlice";
import { fetchAmenities, fetchAmenityCategories } from "../features/amenity/amenitySlice";
import { fetchRules } from "../features/rule/ruleSlice";
import { fetchPrivacies } from "../features/privacy/privacySlice";
import { authState } from "../features/auth/authSlice";
import { fetchBookingDetails } from "../features/bookingDetail/bookingDetailSlice";
import SimpleStatNumber from "../components/booking/SimpleStatNumber";
import StackedBarChart from "../partials/dashboard/DashboardCard09";

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
            case "/amenities/categories": {
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
                        )}{" "}
                        {pathname === "/amenities/categories" && (
                            <>
                                <AmenityCategoriesPage />
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
                                <div className='grid grid-cols-12 gap-6 w-full'>
                                    <div className='flex items-center justify-between w-full'>
                                        <SimpleStatNumber
                                            label='Total Sales In Month'
                                            type='All'
                                            backgroundColor={`bg-violet-500`}
                                            // number={totalElements}
                                        />
                                        <SimpleStatNumber
                                            label='Total Orders'
                                            type='Approved'
                                            backgroundColor={`bg-rose-500`}
                                            // number={numberOfApproved}
                                        />
                                        <SimpleStatNumber
                                            label='Total Houses/Rooms'
                                            type='Pending'
                                            backgroundColor={`bg-amber-500`}
                                            // number={numberOfPending}
                                        />
                                        <SimpleStatNumber
                                            label='Total Users'
                                            type='Cancelled'
                                            backgroundColor={`bg-green-500`}
                                            // number={numberOfCancelled}
                                        />
                                    </div>
                                    <DashboardCard01 />
                                    <DashboardCard02 />
                                    <DashboardCard03 />
                                    <DashboardCard04 />
                                    <DashboardCard05 />
                                    <DashboardCard06 />
                                    <DashboardCard07 />
                                    <DashboardCard08 />
                                    {/* <StackedBarChart /> */}
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
