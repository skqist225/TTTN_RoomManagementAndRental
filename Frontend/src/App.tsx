import { BrowserRouter as Router, Routes, Route, useMatch } from "react-router-dom";
import {
    BecomeAHostIndexPage,
    BookedRoomsPage,
    GuestInboxPage,
    HomePage,
    ManageRoomPage,
    LoginPage,
    ManageBookingsPage,
    ManageRoomDetailsPage,
    ManageRoomPhotosPage,
    ProgressBookingPage,
    ProgressEarningsPage,
    ProgressPage,
    ProgressReviewsPage,
    PropertyAmenitiesPage,
    PropertyCategoryPage,
    PropertyDescriptionPage,
    PropertyLocationPage,
    PropertyPricePage,
    PropertyPrivacyPage,
    PropertyRoomImagesPage,
    PropertyRoomInfoPage,
    PropertyTitlePage,
    PublishCelebrationPage,
    RegisterPage,
    RoomDetailsPage,
    RoomPreviewPage,
    WishListsPage,
} from "./pages";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import PersonalInfoPage from "./pages/PersonalInfoPage";
import CartPage from "./pages/CartPage";
import PropertyRulesPage from "./pages/become_a_host/PropertyRulesPage";

function App() {
    return (
        <div className='App'>
            <Router>
                <Routes>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/account-settings/personal-info' element={<PersonalInfoPage />} />
                    <Route path='/room'>
                        <Route path=':id' element={<RoomDetailsPage />} />
                    </Route>
                    <Route path='/hosting/listings'>
                        <Route path=':page' element={<ManageRoomPage />} />
                    </Route>
                    <Route path='/wishlists' element={<WishListsPage />}></Route>
                    <Route path='/user/booked-rooms' element={<BookedRoomsPage />}></Route>
                    <Route path='/booking/listings'>
                        <Route path=':page' element={<ManageBookingsPage />} />
                    </Route>
                    <Route path='become-a-host'>
                        <Route path='intro' element={<BecomeAHostIndexPage />}></Route>
                        <Route path='category' element={<PropertyCategoryPage />} />
                        <Route path='privacy' element={<PropertyPrivacyPage />} />
                        <Route path='location' element={<PropertyLocationPage />} />
                        <Route path='room-info' element={<PropertyRoomInfoPage />} />
                        <Route path='amenities' element={<PropertyAmenitiesPage />} />
                        <Route path='photos' element={<PropertyRoomImagesPage />} />
                        <Route path='title' element={<PropertyTitlePage />} />
                        <Route path='description' element={<PropertyDescriptionPage />} />
                        <Route path='price' element={<PropertyPricePage />} />
                        <Route path='rule' element={<PropertyRulesPage />} />
                        <Route path='preview' element={<RoomPreviewPage />} />
                        <Route
                            path='publish-celebration/:roomId'
                            element={<PublishCelebrationPage />}
                        ></Route>
                    </Route>
                    <Route path='/manage-your-space'>
                        <Route path=':roomId/details' element={<ManageRoomDetailsPage />}></Route>
                        <Route
                            path=':roomId/details/photos'
                            element={<ManageRoomPhotosPage />}
                        ></Route>
                    </Route>
                    <Route path='/progress'>
                        <Route
                            path='reviews'
                            element={<ProgressPage content={<ProgressReviewsPage />} />}
                        />
                        <Route
                            path='earnings'
                            element={<ProgressPage content={<ProgressEarningsPage />} />}
                        />
                        {/* <Route path='reviews' element={<ProgressReviewsPage />} />
                        <Route path='reviews' element={<ProgressReviewsPage />} />
                        <Route path='reviews' element={<ProgressReviewsPage />} />
                        <Route path='reviews' element={<ProgressReviewsPage />} />
                        <Route path='reviews' element={<ProgressReviewsPage />} /> */}
                    </Route>
                    <Route path='/guest/inbox/:receiverid' element={<GuestInboxPage />} />
                    <Route path='/auth'>
                        <Route path='reset-password' element={<ResetPasswordPage />} />
                        <Route path='register' element={<RegisterPage />} />
                        <Route path='login' element={<LoginPage />} />
                    </Route>
                    <Route path='/bookings' element={<CartPage />} />
                    <Route path='/bookings/checkout' element={<ProgressBookingPage />} />
                </Routes>
            </Router>

            <div></div>
        </div>
    );
}

export default App;
