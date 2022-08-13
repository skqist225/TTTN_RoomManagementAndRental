import React from "react";
import { Image } from "../../../globalStyle";
import { getImage } from "../../../helpers";

const AmenitiyPartial = ({ amenities, className }) => {
    return (
        <>
            <div className='amentities__card-container p-5'>
                {amenities.map(a => (
                    <div className={"amentity__card " + className} key={a.id} data-id={a.id}>
                        <input type='hidden' value={a.id} />
                        <input type='hidden' value={a.name} className='amentityName' />
                        <input type='hidden' value={a.iconImage} />

                        <div>
                            <Image
                                src={getImage(a.iconImagePath)}
                                size='36px'
                                className={className + "Img"}
                            />
                        </div>
                        <div className='amentity__name'>{a.name}</div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default AmenitiyPartial;
