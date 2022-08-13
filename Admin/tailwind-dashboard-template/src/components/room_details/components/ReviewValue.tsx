import React from "react";

const ReviewValue = ({ value, className }) => {
    return <input type='hidden' value={value} className={className} />;
};

export default ReviewValue;
