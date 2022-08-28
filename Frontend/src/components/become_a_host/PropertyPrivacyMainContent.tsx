import { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { Div } from "../../globalStyle";
import { RootState } from "../../store";
import $ from "jquery";
import "./css/privacy_main_content.css";

interface IPropertyPrivacyMainContentProps {}

const PropertyPrivacyMainContent: FC<IPropertyPrivacyMainContentProps> = () => {
    const { roomPrivacies } = useSelector((state: RootState) => state.room);

    useEffect(() => {
        const privacyTypeBox = $(".privacy-type__box");
        const room = localStorage.getItem("room");

        if (room) {
            const { privacy } = JSON.parse(room!);

            if (privacy) {
                privacyTypeBox.each(function () {
                    if ($(this).data("privacy-id") === privacy) {
                        $(this).addClass("active");
                        return false;
                    }
                });
            }
        }

        privacyTypeBox.each(function () {
            $(this)
                .off("click")
                .on("click", function () {
                    privacyTypeBox.each(function () {
                        $(this).removeClass("active");
                    });

                    $(this).addClass("active");
                });
        });
    }, [roomPrivacies]);

    return (
        <Div className='col-flex-center'>
            {roomPrivacies.map(privacy => (
                <div
                    className='privacy-type__box'
                    key={privacy.id}
                    data-privacy-id={privacy.id}
                    data-privacy-name={privacy.name}
                >
                    <div className='content__box--name'>{privacy.name}</div>
                </div>
            ))}
        </Div>
    );
};

export default PropertyPrivacyMainContent;
