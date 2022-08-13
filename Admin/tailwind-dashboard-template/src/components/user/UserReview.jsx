import React from "react";
import { Image } from "../../globalStyle";
import { getImage } from "../../helpers";

function UserReview({ review }) {
    return (
        <div style={{ maxWidth: "629px" }} className='my-10'>
            <div className='mb-4'>
                <div>
                    {new Date(review.createdDate).toLocaleString("default", { month: "long" })}
                    {` `}
                    {new Date(review.createdDate).getFullYear()}
                </div>
                <p style={{ maxWidth: "629px" }} className='text-base break-words'>
                    {review.review}
                </p>
            </div>
            <div className='flex items-center'>
                <div className='mr-4'>
                    <Image
                        src={getImage(review.reviewerInfo.avatar)}
                        size='56px'
                        className='rounded-full'
                    />
                </div>
                <div>
                    <div>{review.reviewerInfo.fullName}</div>
                    <div>Joined in {new Date(review.reviewerInfo.joinDate).getFullYear()}</div>
                </div>
            </div>
        </div>
    );
}

export default UserReview;
