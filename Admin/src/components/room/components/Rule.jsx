import { FC } from "react";
import { Image } from "../../../globalStyle";
import { getImage } from "../../../helpers";

const Rule = ({ rule }) => {
    return (
        <div className='normal-flex' style={{ marginBottom: "8px" }} key={rule.title}>
            <Image src={getImage(rule.iconPath)} size='16px' />
            <span style={{ paddingLeft: "16px" }} className='fs-16'>
                {rule.title}
            </span>
        </div>
    );
};

export default Rule;
