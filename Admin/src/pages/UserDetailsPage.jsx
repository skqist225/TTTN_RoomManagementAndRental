import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchUser, userState } from "../features/user/userSlice";
import { Image } from "../globalStyle";
import { getImage } from "../helpers";
import Header from "../partials/Header";
import "../css/page/user_details.css";
import { Divider, Typography } from "@mui/material";
import { Room } from "../components/home/Room";
import UserReview from "../components/user/UserReview";

function UserDetailsPage() {
    const dispatch = useDispatch();
    const {
        get: { user },
    } = useSelector(userState);
    const { userid } = useParams();

    useEffect(() => {
        dispatch(fetchUser(userid));
    }, []);

    return (
        <>
            <Header sidebarOpen={true} setSidebarOpen={false} />

            {user && (
                <main id='userDetailsPage'>
                    <div className='flex items-start'>
                        <div style={{ flex: "1", maxWidth: "30%" }} className='p-6'>
                            <div id='udpleftBlock'>
                                <div className=''>
                                    <div className='w-full flex justify-center mb-4'>
                                        <Image
                                            src={getImage(user.avatarPath)}
                                            alt=''
                                            size='128px'
                                            className='mb-4 rounded-full'
                                        />
                                    </div>
                                    <div className='flex mb-4'>
                                        <Image
                                            src={getImage("/svg/empty_star.svg")}
                                            size='20px'
                                            className='mr-1'
                                        />
                                        <span> {user.reviews && user.reviews.length} reviews</span>
                                    </div>
                                    {user.identityVerified && (
                                        <div className='flex mb-4'>
                                            <Image
                                                src={getImage("/svg/identity_verified.svg")}
                                                size='20px'
                                                className='mr-1'
                                            />{" "}
                                            <span>Identity verified</span>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className='mb-4 leading-7 text-2xl font-semibold'>
                                        {user.lastName} confirmed
                                    </div>
                                    <div className='flex w-full h-9'>
                                        {!user.identityVerified ? (
                                            <Image
                                                src={getImage("/svg/close2.svg")}
                                                size='20px'
                                                className='mr-10'
                                            />
                                        ) : (
                                            <Image
                                                src={getImage("/svg/check.svg")}
                                                size='20px'
                                                className='mr-10'
                                            />
                                        )}
                                        <span>Identity</span>
                                    </div>
                                    <div className='flex w-full h-9'>
                                        {!user.emailVerified ? (
                                            <Image
                                                src={getImage("/svg/close2.svg")}
                                                size='20px'
                                                className='mr-10'
                                            />
                                        ) : (
                                            <Image
                                                src={getImage("/svg/check.svg")}
                                                size='20px'
                                                className='mr-10'
                                            />
                                        )}
                                        <span>Email address</span>
                                    </div>
                                    <div className='flex w-full h-9'>
                                        {!user.phoneVerified ? (
                                            <Image
                                                src={getImage("/svg/close2.svg")}
                                                size='20px'
                                                className='mr-10'
                                            />
                                        ) : (
                                            <Image
                                                src={getImage("/svg/check.svg")}
                                                size='20px'
                                                className='mr-10'
                                            />
                                        )}
                                        <span>Phone number</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ flex: "1", maxWidth: "5%" }} />
                        <div
                            style={{ flex: "1", maxWidth: "60%" }}
                            id='udpRightBlock'
                            className='p-6'
                        >
                            <div>
                                <div>
                                    <h1 className='h-9 font-semibold text-2xl'>{user.fullName}</h1>
                                    <div>Joined in {new Date(user.createdDate).getFullYear()}</div>
                                </div>

                                <div className='my-5' style={{ maxWidth: "90%" }}>
                                    <h1 className='h-9 font-semibold text-lg'>About</h1>
                                    <p style={{ fontSize: "16px", lineHeight: "20px" }}>
                                        {user.about}
                                    </p>
                                </div>

                                <div className='flex items-center'>
                                    <Image
                                        src={getImage("/svg/home.svg")}
                                        size='20px'
                                        className='mr-10'
                                    />{" "}
                                    <span className='text-base'>
                                        Lives in {user.fullPathAddress}
                                    </span>
                                </div>
                            </div>
                            <div className='my-10'>
                                <Divider />
                            </div>
                            <div>
                                <div className='pb-6'>
                                    <h2 className='font-semibold'>{user.fullName}'s listing</h2>
                                </div>
                                <div className='flex items-center justify-evenly'>
                                    {user.theTwoMostBookedRoom &&
                                        user.theTwoMostBookedRoom.map((room, index) => {
                                            return <Room room={room} index={index} key={index} />;
                                        })}
                                </div>
                            </div>
                            <div className='my-10'>
                                <Divider />
                            </div>
                            <div className='col-flex'>
                                <div className='flex items-center'>
                                    <Image
                                        src={getImage("/svg/star.svg")}
                                        size='15px'
                                        className='mr-5'
                                    />
                                    <span>{user.reviews && user.reviews.length} reviews</span>
                                </div>
                                <div>
                                    <div>
                                        {user.reviews &&
                                            user.reviews.map(review => (
                                                <UserReview review={review} key={review.id} />
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            )}
        </>
    );
}

export default UserDetailsPage;
