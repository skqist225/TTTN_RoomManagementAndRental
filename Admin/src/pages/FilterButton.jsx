import React from "react";
import styled from "styled-components";
import { Div, Image } from "../globalStyle";
import { getImage } from "../helpers";
import FilterFooter from "./FilterFooter";

const FilterBox = styled.div`
    -webkit-box-direction: normal;
    -webkit-box-orient: vertical;
    position: absolute;
    margin-top: 12px;
    background: rgb(255, 255, 255);
    border-radius: 12px;
    border: 0.5px solid rgba(118, 118, 118, 0.28);
    box-shadow: rgb(0 0 0 / 28%) 0px 8px 28px;
    z-index: 2001;

    width: ${props => props.width};
    height: ${props => props.height};

    top: 100%;
    left: 0px;
    right: auto;
    display: none;

    &.active {
        display: block !important;
    }
`;

const FilterButton = ({
    dataDropDown,
    title,
    width,
    height,
    content,
    footerOf,
    haveBox = true,
}) => {
    return (
        <div className='listings__filter'>
            <button className={`listings__filter--option ${footerOf}`} data-dropdown={dataDropDown}>
                <span>{title}</span>
                {haveBox && (
                    <span>
                        <Image src={getImage("/svg/dropdown.svg")} size='12px' />
                    </span>
                )}
            </button>
            {haveBox && (
                <FilterBox id={dataDropDown} width={width} height={height}>
                    <Div className='col-flex'>
                        {content}
                        <FilterFooter footerOf={footerOf} />
                    </Div>
                </FilterBox>
            )}
        </div>
    );
};

export default FilterButton;
