import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import FavRoom from "../components/progress_booking/FavRoom";
import { fetchWishlistsOfCurrentUser, userState } from "../features/user/userSlice";
import { getImage } from "../helpers";

import "./css/wishlists.css";

interface WishListsPage {}

const WishListsPage: FC<WishListsPage> = () => {
    const dispatch = useDispatch();
    const { user, wishlists } = useSelector(userState);

    useEffect(() => {
        if (user !== null) dispatch(fetchWishlistsOfCurrentUser());
    }, [user]);

    return (
        <>
            <Header includeMiddle={false} excludeBecomeHostAndNavigationHeader={true} />
            <div>
                <div className='wishlists__container'>
                    <div className='wishlists__word'>Danh sách yêu thích</div>

                    <div className='normal-flex' id='wishlists__wrapper'>
                        {wishlists.map(room => (
                            <Link to={`/room/${room.id}`}>
                                <FavRoom room={room} />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default WishListsPage;
