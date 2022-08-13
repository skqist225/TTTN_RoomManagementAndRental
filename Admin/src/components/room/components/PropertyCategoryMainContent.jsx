import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { categoryState, fetchCategories } from "../../../features/category/categorySlice";
import { Image } from "../../../globalStyle";
import { getImage } from "../../../helpers";
import $ from "jquery";
import "../css/category_main_content.css";

const PropertyCategoryMainContent = ({ category, setCategory, activeStep }) => {
    const {
        listing: { categories, loading },
    } = useSelector(categoryState);

    const dispatch = useDispatch();

    useEffect(() => {
        const categoryBox = $(".category__box");

        categoryBox.each(function () {
            $(this)
                .off("click")
                .on("click", function () {
                    categoryBox.each(function () {
                        $(this).removeClass("active");
                    });

                    $(this).addClass("active");
                    setCategory($(this).data("category"));
                });
        });
    }, [categories]);

    useEffect(() => {
        if (category) {
            const categoryBox = $(".category__box");

            categoryBox.each(function () {
                if ($(this).data("category") === category) {
                    $(this).addClass("active");
                } else {
                    $(this).removeClass("active");
                }
            });
        }
    }, [categories, activeStep]);

    useEffect(() => {
        dispatch(fetchCategories());
    }, []);

    return (
        <>
            {!loading && (
                <div id='room-category__mainContainer'>
                    {categories.map(c => (
                        <div className='category__box' key={c.id} data-category={c.id}>
                            <div className='flex items-center justify-between'>
                                <div className='content__box--name'>{c.name}</div>
                                <div>
                                    <Image src={getImage(c.icon)} size='24px' />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default PropertyCategoryMainContent;
