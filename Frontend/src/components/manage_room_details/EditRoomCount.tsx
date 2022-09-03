import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ManageYSContainer } from ".";
import { categoryState, fetchCategories } from "../../features/category/categorySlice";
import { fetchRoomPrivacies, roomState } from "../../features/room/roomSlice";
import { Div } from "../../globalStyle";
import { IRoomDetails } from "../../types/room/type_RoomDetails";
import BoxFooter from "./BoxFooter";
import { HideEditBox } from "./components";
import DisplayEditUI from "./components/DisplayEditUI";

import { hideEditBox } from "../../pages/script/manage_your_space";
import { IncAndDecBtn } from "../utils/IncAndDecBtn";

interface IEditRoomCountProps {
    room: IRoomDetails;
}

const EditRoomCount: FC<IEditRoomCountProps> = ({ room }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchRoomPrivacies());
    }, []);
    const { roomPrivacies } = useSelector(roomState);
    const { categories } = useSelector(categoryState);

    return (
        <ManageYSContainer id='roomInfo' data-aos='fade-up' data-aos-duration='2000'>
            <div>
                <div className='manage--ys__section--title'>Chỗ ở và phòng</div>
                <div>
                    <div>
                        <div
                            style={{ height: "85px", borderBottom: "1px solid #d3d6db" }}
                            className='flex-space'
                            id='manage-ys__categoryAndPrivacy-control-view'
                        >
                            <div>
                                <div className='manage-ys__section-content-title'>Loại chỗ ở</div>
                                <div className='manage-ys__section-content-info'>
                                    Thể loại: <b style={{ color: "#222" }}> {room.category} </b>
                                </div>
                                <div className='manage-ys__section-content-info'>
                                    Loại hình cho thuê:{" "}
                                    <b style={{ color: "#222" }}> {room.privacy} </b>
                                </div>
                            </div>
                            <div>
                                <DisplayEditUI sectionKey='categoryAndPrivacy' />
                            </div>
                        </div>
                        <div id='manage-ys__categoryAndPrivacy-control-container'>
                            <div className='manage-ys__location-control-content'>
                                <div className='flex-space'>
                                    <div className='manage-ys__header-edit-main-title'>
                                        Loại chỗ ở
                                    </div>
                                    <HideEditBox
                                        sectionKey='categoryAndPrivacy'
                                        hideEditBox={hideEditBox}
                                    />
                                </div>
                                <div>
                                    <div>
                                        <div className='manage-ys__label'>
                                            Loại nào giống nhà/phòng cho thuê của bạn nhất?
                                        </div>
                                    </div>
                                    <div>
                                        <div className='manage-ys__label'>Loại nhà/phòng</div>
                                        <div>
                                            <select
                                                id='manage-ys__type-input'
                                                className='manage-ys__input'
                                            >
                                                {categories.map(category => (
                                                    <option
                                                        key={category.id}
                                                        value={category.id}
                                                        selected={category.id === room?.categoryId}
                                                    >
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <div>Loại nhà/phòng cho thuê</div>
                                        <div>
                                            <select
                                                id='manage-ys__privacy-input'
                                                className='manage-ys__input'
                                            >
                                                {roomPrivacies.map(privacy => (
                                                    <option
                                                        value={privacy.id}
                                                        selected={privacy.id === room!.privacyId}
                                                    >
                                                        {privacy.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <BoxFooter
                                sectionKey='categoryAndPrivacy'
                                idInput=''
                                hideEditBox={hideEditBox}
                            />
                        </div>
                    </div>

                    <div>
                        <div id='manage-ys__roomInfo-control-view'>
                            <Div className='flex-space' height='139px'>
                                <div>
                                    <div
                                        className='manage-ys__section-content-title'
                                        style={{ fontWeight: "bold" }}
                                    >
                                        Phòng và không gian khác
                                    </div>
                                    <div className='manage-ys__section-content-info'>
                                        Số khách: {room?.guest}
                                    </div>
                                    <div className='manage-ys__section-content-info'>
                                        Phòng ngủ: {room?.bedroom}
                                    </div>
                                    <div className='manage-ys__section-content-info'>
                                        Giường: {room?.bed}
                                    </div>
                                    <div className='manage-ys__section-content-info'>
                                        Phòng tắm: {room?.bathroom}
                                    </div>
                                </div>
                                <div>
                                    <DisplayEditUI sectionKey='roomInfo' />
                                </div>
                            </Div>
                        </div>
                        <div id='manage-ys__roomInfo-control-container'>
                            <div className='manage-ys__location-control-content'>
                                <div className='flex-space'>
                                    <div className='manage-ys__header-edit-main-title'>
                                        Phòng ngủ và không gian khác
                                    </div>
                                    <HideEditBox sectionKey='roomInfo' hideEditBox={hideEditBox} />
                                </div>

                                <div className='flex-space manage-ys__section-content'>
                                    <div className='manage-ys__section-content-title'>
                                        Số lượng khách
                                    </div>
                                    <div>
                                        <IncAndDecBtn
                                            dataEdit='manage-ys__guest'
                                            dataTrigger=''
                                            data={room!.accomodates}
                                        />
                                    </div>
                                </div>

                                <div className='flex-space manage-ys__section-content'>
                                    <div className='manage-ys__section-content-title'>
                                        Phòng ngủ
                                    </div>
                                    <div>
                                        <IncAndDecBtn
                                            dataEdit='manage-ys__bedRoom'
                                            dataTrigger=''
                                            data={room!.bedroom}
                                        />
                                    </div>
                                </div>

                                <div className='flex-space manage-ys__section-content'>
                                    <div className='manage-ys__section-content-title'>Giường</div>
                                    <div>
                                        <IncAndDecBtn
                                            dataEdit='manage-ys__bed'
                                            dataTrigger=''
                                            data={room!.bed}
                                        />
                                    </div>
                                </div>

                                <div className='flex-space manage-ys__section-content'>
                                    <div className='manage-ys__section-content-title'>
                                        {" "}
                                        Phòng tắm
                                    </div>
                                    <div>
                                        <IncAndDecBtn
                                            dataEdit='manage-ys__bathRoom'
                                            dataTrigger=''
                                            data={room!.bathroom}
                                        />
                                    </div>
                                </div>
                            </div>
                            <BoxFooter sectionKey='roomInfo' idInput='' hideEditBox={hideEditBox} />
                        </div>
                    </div>
                </div>
            </div>
        </ManageYSContainer>
    );
};

export default EditRoomCount;
