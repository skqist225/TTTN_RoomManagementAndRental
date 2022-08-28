import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Image } from "../../globalStyle";
import { fetchRules, ruleState } from "../../features/rule/ruleSlice";
import { getImage } from "../../helpers";

import $ from "jquery";
import "./css/amenities_main_content.css";

interface IPropertyRulesMainContentProps {}

const PropertyRulesMainContent: FC<IPropertyRulesMainContentProps> = () => {
    const dispatch = useDispatch();

    const {
        listing: { rules },
    } = useSelector(ruleState);

    useEffect(() => {
        dispatch(fetchRules());
    }, []);

    useEffect(() => {
        const amenitiesClass = $(".amentitiesClassName");

        if (localStorage.getItem("room")) {
            const { rules } = JSON.parse(localStorage.getItem("room")!);

            if (rules && rules.length > 0) {
                amenitiesClass.each(function () {
                    if (
                        rules.includes(
                            parseInt($(this).children("input").first().val()!.toString())
                        )
                    ) {
                        $(this).addClass("chosen");
                    }
                });
            }
        }

        amenitiesClass.each(function () {
            $(this)
                .off("click")
                .on("click", function () {
                    const self = $(this);
                    const amenityName = $(this).children(".amentity__name").text();
                    let isRemovedClassName = false;

                    const chosenArray = amenitiesClass.filter(".chosen");

                    if (chosenArray.length > 0) {
                        amenitiesClass.filter(".chosen").each(function () {
                            if (amenityName === $(this).children(".amentity__name").text()) {
                                self.removeClass("chosen");
                                isRemovedClassName = true;
                            }
                        });
                    }

                    if (!isRemovedClassName) {
                        $(this).addClass("chosen");
                    }
                });
        });
    }, [rules]);

    return (
        <>
            <div className='amentities__card-container'>
                {rules.map((rule: any) => (
                    <div className={"amentity__card amentitiesClassName"} key={rule.id}>
                        <input type='hidden' value={rule.id} />
                        <input type='hidden' value={rule.title} className='amentityName' />
                        <div>
                            <Image src={getImage(rule.iconPath)} size='29px' className={"Img"} />
                        </div>
                        <div className='amentity__name'>{rule.title}</div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default PropertyRulesMainContent;
