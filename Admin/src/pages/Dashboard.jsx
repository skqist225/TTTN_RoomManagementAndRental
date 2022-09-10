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
import SimpleStatNumber from "../components/booking/SimpleStatNumber";
import StackedBarChart from "../partials/dashboard/DashboardCard09";
import {
    countUserByRole,
    dashboardState,
    getCreatedRoomByMonthAndYear,
    statsCount,
} from "../features/dashboard/dashboardSlice";
import LineChart from "../partials/dashboard/LineChart";
import LineChartDashboard from "../partials/dashboard/LineChartDashboard";
import CircleChart from "../partials/dashboard/CircleChart";
import {
    bookingState,
    fetchBookingsCountByMonthAndYear,
    getBookingsRevenueByYear,
} from "../features/booking/bookingSlice";

function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const { pathname } = useLocation();
    const { user } = useSelector(userState);
    const {
        loginAction: { loading },
    } = useSelector(authState);

    const {
        statsCountAction: {
            loading: statsCountActionLoading,
            totalSales,
            totalBookings,
            totalRooms,
            totalUsers,
        },
        getCreatedRoomByMonthAndYearAction: {
            loading: getCreatedRoomByMonthAndYearActionLoading,
            activeList,
            deactiveList,
        },
        countUserByRoleAction: {
            loading: countUserByRoleActionLoading,
            numberOfUsers,
            numberOfAdmin,
            numberOfHost,
        },
    } = useSelector(dashboardState);

    const {
        countBookingAction: {
            numberOfApproved,
            numberOfPending,
            numberOfCancelled,
            numberOfAllBookings,
        },
        fetchBookingsCountByMonthAndYearAction: {
            loading: fetchBookingsCountByMonthAndYearActionLoading,
            numberOfApproved: numberOfApprovedArr,
            numberOfPending: numberOfPendingArr,
            numberOfCancelled: numberOfCancelledArr,
        },
        getBookingsRevenueByYearAction: { loading: gbrLoading, revenue, refund },
    } = useSelector(bookingState);

    const lcdataSet1 = Array.from({ length: 24 }).fill(0);
    const lcdataSet2 = Array.from({ length: 24 }).fill(0);

    activeList.forEach(({ number, month, year }) => {
        if (year.toString() === "2022") {
            lcdataSet1[month + 12 - 1] = number;
        } else {
            lcdataSet1[month - 1] = number;
        }
    });
    deactiveList.forEach(({ number, month, year }) => {
        if (year.toString() === "2022") {
            lcdataSet2[month + 12 - 1] = number;
        } else {
            lcdataSet2[month - 1] = number;
        }
    });

    useEffect(() => {
        switch (pathname) {
            case "/": {
                dispatch(statsCount());
                dispatch(getCreatedRoomByMonthAndYear());
                dispatch(countUserByRole());
                dispatch(fetchBookingsCountByMonthAndYear(new Date().getFullYear()));
                dispatch(getBookingsRevenueByYear(new Date().getFullYear()));
                break;
            }
            case "/rooms": {
                dispatch(
                    fetchRooms({
                        page: 1,
                    })
                );
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
                dispatch(
                    fetchUsers({
                        page: 1,
                    })
                );
                break;
            }
        }
    }, [pathname]);

    const dataSet1 = Array.from({ length: 12 }).fill(0);
    const dataSet2 = Array.from({ length: 12 }).fill(0);
    const dataSet3 = Array.from({ length: 12 }).fill(0);
    numberOfApprovedArr.forEach(({ number, month }) => {
        dataSet1[month - 1] = number;
    });
    numberOfPendingArr.forEach(({ number, month }) => {
        dataSet2[month - 1] = number;
    });
    numberOfCancelledArr.forEach(({ number, month }) => {
        dataSet3[month - 1] = number;
    });

    const lcdataSet11 = Array.from({ length: 12 }).fill(0);
    const lcdataSet22 = Array.from({ length: 12 }).fill(0);

    revenue.forEach(({ number, month }) => {
        lcdataSet11[month - 1] = number;
    });
    refund.forEach(({ number, month }) => {
        lcdataSet22[month - 1] = number;
    });

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
                        {pathname === "/" && (
                            <>
                                {/* <WelcomeBanner /> */}

                                <div>
                                    <div className='flex items-center justify-between w-full'>
                                        <SimpleStatNumber
                                            label='Total Sales In Month'
                                            type='All'
                                            backgroundColor={`bg-violet-500`}
                                            number={totalSales}
                                        />
                                        <SimpleStatNumber
                                            label='Total Bookings'
                                            type='Approved'
                                            backgroundColor={`bg-rose-500`}
                                            number={totalBookings}
                                        />
                                        <SimpleStatNumber
                                            label='Total Houses/Rooms'
                                            type='Pending'
                                            backgroundColor={`bg-amber-500`}
                                            number={totalRooms}
                                        />
                                        <SimpleStatNumber
                                            label='Total Users'
                                            type='Cancelled'
                                            backgroundColor={`bg-green-500`}
                                            number={totalUsers}
                                        />
                                    </div>
                                    {/* <DashboardCard01 /> */}
                                    {/* <DashboardCard02 /> */}
                                    {/* <DashboardCard03 /> */}

                                    <div className='my-10'>
                                        {!getCreatedRoomByMonthAndYearActionLoading && (
                                            <LineChartDashboard
                                                data={[lcdataSet1, lcdataSet2]}
                                                label='Created Room By Month'
                                            />
                                        )}
                                    </div>
                                    <div>
                                        {/* <DashboardCard04 /> */}
                                        {/* <DashboardCard05 /> */}
                                        {!countUserByRoleActionLoading && (
                                            <CircleChart
                                                data={[numberOfUsers, numberOfHost, numberOfAdmin]}
                                            />
                                        )}
                                        {/* <DashboardCard06 /> */}
                                        {/* <DashboardCard07 />
                                        <DashboardCard08 /> */}
                                        {/* <StackedBarChart /> */}
                                        {/* <DashboardCard10 /> */}
                                        {/* <DashboardCard11 />
                                        <DashboardCard12 />
                                        <DashboardCard13 /> */}
                                    </div>
                                    <div className='my-10'>
                                        {!fetchBookingsCountByMonthAndYearActionLoading && (
                                            <StackedBarChart
                                                data={[dataSet1, dataSet2, dataSet3]}
                                            />
                                        )}
                                    </div>
                                    <div className='my-10'>
                                        {!gbrLoading && (
                                            <LineChart
                                                data={[lcdataSet11, lcdataSet22]}
                                                label='Sales Over Time (all bookings)'
                                            />
                                        )}
                                    </div>
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
