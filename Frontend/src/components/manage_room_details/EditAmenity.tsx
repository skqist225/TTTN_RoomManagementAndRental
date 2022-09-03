import { FC } from "react";
import { ManageYSContainer } from ".";
import { hideEditBox } from "../../pages/script/manage_your_space";
import { IRoomDetails } from "../../types/room/type_RoomDetails";
import IAmenity from "../../types/type_Amenity";
import BoxFooter from "./BoxFooter";
import DisplayEditUI from "./components/DisplayEditUI";
import HideEditBox from "./components/HideEditBox";
import RoomAmenities from "./components/RoomAmenities";

interface IEditAmenityProps {
    amenities: IAmenity[];
    room: IRoomDetails;
}

const EditAmenity: FC<IEditAmenityProps> = ({ amenities, room }) => {
    return (
        <ManageYSContainer id='roomAmentities'>
            <div id='manage-ys__amentities-control-view' className='flex-space'>
                <div>
                    <div className='manage--ys__section--title'>Tiện nghi</div>
                    <div>
                        {room.amenities &&
                            room.amenities.length &&
                            room.amenities.map(a => (
                                <div key={a.id}>
                                    <div
                                        data-amenity-id={a.id}
                                        className='manage-ys__section-content-info'
                                    >
                                        {a.name}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
                <div>
                    <DisplayEditUI sectionKey='amentities' />
                </div>
            </div>
            <div id='manage-ys__amentities-control-container'>
                <div className='manage-ys__location-control-content'>
                    <div className='flex-space'>
                        <div className='manage-ys__header-edit-main-title'>Tiện nghi</div>
                        <HideEditBox sectionKey='amentities' hideEditBox={hideEditBox} />
                    </div>
                    <RoomAmenities amentities={amenities} />
                </div>
                <BoxFooter sectionKey='amenities' idInput='' hideEditBox={hideEditBox} />
            </div>
        </ManageYSContainer>
    );
};

export default EditAmenity;
