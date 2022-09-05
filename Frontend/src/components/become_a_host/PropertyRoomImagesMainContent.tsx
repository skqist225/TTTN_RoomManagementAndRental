import { FC, useEffect, useState } from "react";
import { Image } from "../../globalStyle";
import { callToast, getImage } from "../../helpers";
import axios from "../../axios";
import { useSelector } from "react-redux";
import { userState } from "../../features/user/userSlice";
import $ from "jquery";

import "./css/room_images_main_content.css";

interface IPropertyRoomImagesMainContentProps {}

let photos: File[] = [];

const PropertyRoomImagesMainContent: FC<IPropertyRoomImagesMainContentProps> = () => {
    const [loading, setLoading] = useState(true);

    const { user } = useSelector(userState);

    useEffect(() => {
        const uploadPhotos: JQuery<HTMLInputElement> = $("#uploadPhotos");
        $("#triggerUploadPhotosInput")
            .off("click")
            .on("click", function (e) {
                e.preventDefault();
                uploadPhotos.trigger("click");
            });

        uploadPhotos.off("change").on("change", function () {
            readURL(this.files as any, uploadPhotos);
        });

        restoreRoomImages(uploadPhotos);
    }, []);

    function addEmptyImage(
        files: File[] | FileList,
        uploadPhotos: any,
        subImagesContainer: JQuery<HTMLElement>
    ) {
        if (files.length - 1 < 4) {
            for (let i = 0; i <= 4 - files.length; i++) {
                const div = $(
                    `<div class="singleImageContainer containerOfImageIcon">
                    <img class="imageIcon" src="${getImage("/amentity_images/single_image.svg")}"/>
                </div>`
                );
                subImagesContainer.append(div);
            }
        } else {
            const div = $(
                `<div class="singleImageContainer containerOfImageIcon">
                <img class="imageIcon" src="${getImage("/amentity_images/single_image.svg")}"/>
            </div>`
            );

            subImagesContainer.append(div);
        }

        const singleImageContainer = $(".singleImageContainer");
        if (singleImageContainer.length > 0) {
            singleImageContainer.each(function (e) {
                if (
                    !$(this).children(`img[src="${getImage("/amentity_images/single_image.svg")}"]`)
                ) {
                    $(this).removeClass("singleImageContainer");
                    $(this).off("click");
                } else {
                    $(this).on("click", function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                        uploadPhotos.trigger("click");
                    });
                }
            });
        }
    }

    async function restoreRoomImages(uploadPhotos: JQuery<HTMLInputElement>) {
        const room = localStorage.getItem("room");
        if (room) {
            const { images, username } = JSON.parse(room);

            if (images && images.length && username) {
                console.log($("img.photo").length);
                console.log(images.length);

                if ($("img.photo").length === images.length) {
                    return;
                }
                const formData = new FormData();
                formData.set("host", username);
                images.forEach((image: string) => formData.append("roomImages", image));

                const data = await axios.post(`/become-a-host/get-upload-photos`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                const filesArr = (data as any).roomImages.map((e: any) => {
                    var array = new Uint8Array(e.bytes);
                    const blob = new Blob([array], { type: "image/jpeg" });
                    return new File([blob], e.name, {
                        type: `image/jpeg`,
                    });
                });

                readURL(filesArr, uploadPhotos);
            }
        }
    }

    function previewImage(
        file: File,
        parent: JQuery<HTMLElement>,
        thumbnail = false,
        modifier: number
    ) {
        const defer = $.Deferred();
        const fileReader = new FileReader();
        const photoAction = $(`
        <div class="photoAction">
            <button class="photo-action__btn" data-index="${modifier}">
                <span>
                    <img src="${getImage(
                        "/amentity_images/threedot.svg"
                    )}" width="16px" height="16px"/>
                </span>
            </button>
            <div class="photo-action__div-hidden">
                <ul data-index="${modifier}" data-name="${file.name}">
                    <li class="makeMainImage">Chọn làm ảnh chính</li>
                    <li class="deleteImage">Xóa ảnh</li>
                </ul>
            </div>
        </div>
    `);

        fileReader.onload = function (e: any) {
            if (!thumbnail) {
                const div = $(`
                <div class="photo-cover">
                    <img class="photo" src="${e.target.result}" data-index="${modifier}" data-name="${file.name}"/>
                </div>
            `);

                div.append(photoAction);
                parent.append(div);
            } else {
                const image = $(
                    ` <img class="photo" src="${e.target.result}" data-index="${modifier}" data-name="${file.name}"/>`
                );
                parent.append(image);
                parent.append(photoAction);
            }
        };

        fileReader.onloadend = function () {
            $(".photo-action__btn").each(function () {
                $(this)
                    .off("click")
                    .on("click", function () {
                        displayAction($(this));
                    });
            });

            $(".makeMainImage").each(function () {
                $(this)
                    .off("click")
                    .on("click", function () {
                        makeMainImage(parseInt($(this).parent("ul").data("index")));
                    });
            });

            $(".deleteImage").each(function () {
                $(this)
                    .off("click")
                    .on("click", function () {
                        deleteImage(
                            parseInt($(this).parent("ul").data("index")),
                            $(this).parent("ul").data("name")
                        );
                    });
            });

            defer.resolve();
        };

        fileReader.readAsDataURL(file);
        return defer.promise();
    }

    function doPreviewImage(files: any, subImagesContainer: JQuery<HTMLElement>) {
        //first image for thumbnail
        setLoading(true);
        const defer = $.Deferred();

        var promise = previewImage(files[0], $("#thumbnailPhotos"), true, 0);
        promise.done(function () {
            photos.push(files[0]);

            if (photos.length === files.length) {
                defer.resolve();
                setLoading(false);
            }

            for (let i = 1; i < files.length; i++) {
                const promise = previewImage(files[i], subImagesContainer, false, i);
                promise.done(function () {
                    photos.push(files[i]);
                    if (photos.length === files.length) {
                        defer.resolve();
                        setLoading(false);
                    }
                });
            }
        });

        //the rest of images
        return defer.promise();
    }

    function doPreviewImageSecondTime(files: any, subImagesContainer: JQuery<HTMLElement>) {
        const defer = $.Deferred();
        let count = 0;
        setLoading(true);

        const imageNames = photos.map(({ name }) => name);
        console.log("[imageNames] : ", imageNames);
        let copiedFiles = [];
        if (imageNames.length > 0) {
            if (files.length === 1) {
                console.log("[files.length === 1] : ", files[0].name);
                if (imageNames.includes(files[0].name)) {
                    defer.resolve();
                    return defer.promise();
                }
            } else {
                for (let i = 0; i < files.length; i++) {
                    console.log(files[i].name);
                    if (!imageNames.includes(files[i].name)) {
                        copiedFiles.push(files[i]);
                    }
                }
            }
        }

        files = copiedFiles;

        if (files.length === 0) {
            defer.resolve();
            return defer.promise();
        }

        var promise = previewImage(files[0], subImagesContainer, false, photos.length);

        promise.done(function () {
            photos.push(files[0]);
            count++;

            if (count === files.length) {
                defer.resolve();
                setLoading(false);
            } else {
                let lastIndex = photos.length;

                for (let i = 1; i < files.length; i++) {
                    const promise = previewImage(files[i], subImagesContainer, false, lastIndex++);

                    promise.done(function () {
                        photos.push(files[i]);
                        count++;
                        if (count === files.length) {
                            defer.resolve();
                            setLoading(false);
                        }
                    });
                }
            }
        });

        return defer.promise();
    }

    function readURL(files: File[] | FileList, uploadPhotos: JQuery<HTMLInputElement>) {
        const subImagesContainer = $("#subImages");

        if (photos.length === 0) {
            if (files.length > 0) {
                $(".photosContainer").addClass("active");
                $(".drag_n_drop_zone").addClass("disabled");

                if (files.length === 5) $("#addAtLeast5Images").text("Hoàn tất! Bạn thấy thế nào?");

                var promise = doPreviewImage(files, subImagesContainer);
                promise.done(function () {
                    addEmptyImage(files, uploadPhotos, subImagesContainer);
                });
            }
        } else {
            const singleImageContainer = $(".singleImageContainer");
            singleImageContainer.remove();

            if (photos.length > 0) $("#addAtLeast5Images").text("Hoàn tất! Bạn thấy thế nào?");

            var promise = doPreviewImageSecondTime(files, subImagesContainer);
            promise.done(function () {
                addEmptyImage(photos, uploadPhotos, subImagesContainer);
            });
        }
    }

    function displayAction(self: JQuery<HTMLElement>) {
        const sibling = self.siblings(".photo-action__div-hidden");

        if (sibling.hasClass("active")) sibling.removeClass("active");
        else sibling.addClass("active");
    }

    function swapPosition(firstEl: any, secondEl: any) {
        const temp = photos[firstEl];
        photos[firstEl] = photos[secondEl];
        photos[secondEl] = temp;
    }

    function changePreviewImage(swapIndex: number) {
        let firstSrc = "",
            firstImageName = "";
        let secondSrc = "",
            secondImageName = "";

        $("img.photo").each(function (index) {
            if (index === 0) {
                firstSrc = $(this).attr("src")!;
                firstImageName = $(this).data("name");
            }

            if (index === swapIndex) {
                secondSrc = $(this).attr("src")!;
                secondImageName = $(this).data("name");
            }
        });

        $("img.photo").each(function (index) {
            if (index === 0) {
                $(this).attr("src", secondSrc);
                $(this).data("name", secondImageName);
            }

            if (index === swapIndex) {
                $(this).attr("src", firstSrc);
                $(this).data("name", firstImageName);
            }
        });
    }

    function closeAction(index: number) {
        const _self = $(`button[data-index="${index}"]`);

        const sibling = _self.siblings(".photo-action__div-hidden");
        if (sibling.hasClass("active")) sibling.removeClass("active");
    }

    function updateLocalStorage(images: File[]) {
        const lsRoom = localStorage.getItem("room");
        let room = {};
        if (!lsRoom) {
            callToast("error", "Room does not exist in local storage");
            return;
        } else {
            room = JSON.parse(lsRoom);
            room = {
                ...room,
                images: images.map(({ name }) => name),
            };
        }

        localStorage.setItem("room", JSON.stringify(room));
    }

    function makeMainImage(index: number) {
        swapPosition(0, index);
        changePreviewImage(index);
        updateLocalStorage(photos);
        closeAction(index);
    }

    function changePreviewImage2(firstImageIndex: number, secondImageIndex: number) {
        let firstSrc = "",
            firstImageName = "";
        let secondSrc = "",
            secondImageName = "";

        $("img.photo").each(function (index) {
            if (index === firstImageIndex) {
                firstSrc = $(this).attr("src")!;
                firstImageName = $(this).data("name");
            }

            if (index === secondImageIndex) {
                secondSrc = $(this).attr("src")!;
                secondImageName = $(this).data("name");
            }
        });

        $("img.photo").each(function (index) {
            if (index === firstImageIndex) {
                $(this).attr("src", secondSrc);
                $(this).data("name", secondImageName);
            }

            if (index === secondImageIndex) {
                $(this).attr("src", firstSrc);
                $(this).data("name", firstImageName);
            }
        });
    }

    function deleteImage(index: number, imageName: string) {
        console.log("[Deleted index]: ", index);
        console.log("[Deleted name] : ", imageName);

        if (photos.length === 1) {
            // if just one image left
            photos = [];
            $("#thumbnailPhotos").children(".photo").remove();
            $(".photosContainer").removeClass("active");
            $(".drag_n_drop_zone").removeClass("disabled");
            $("#subImages").empty();
        }

        for (let i = index; i < photos.length; i++) {
            changePreviewImage2(i, i + 1);
        }

        photos = photos.filter(image => image.name !== imageName);

        updateLocalStorage(photos);

        // // Remove preview image
        const lastElement = $("#subImages").children(".photo-cover").last();
        lastElement.remove();

        const subImagesContainer = $("#subImages");
        const uploadPhotos = $("#uploadPhotos");
        let b = 0;
        if (photos.length < 4) {
            $(".singleImageContainer.containerOfImageIcon").length > 2
                ? (b = 1)
                : addEmptyImage(photos, uploadPhotos, subImagesContainer);
        }

        closeAction(index);
    }

    async function uploadImagesToFolder() {
        if (photos.length === 0) {
            callToast("error", "Vui lòng chọn ít nhất 1 hình ảnh.");
            return;
        }

        const formData = new FormData();
        formData.set("host", user!.email);
        photos.forEach(photo => formData.append("photos", photo));

        const data = await axios.post(`/become-a-host/upload-room-photos`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        if ((data.status as any) === "success") {
            callToast("success", "Tải ảnh lên thành công");
            let room = localStorage.getItem("room");
            if (!room) {
                localStorage.setItem(
                    "room",
                    JSON.stringify({
                        images: photos.map(({ name }) => name),
                        username: (data as any).username,
                    })
                );
            } else {
                localStorage.setItem(
                    "room",
                    JSON.stringify({
                        ...JSON.parse(room),
                        images: photos.map(({ name }) => name),
                        username: (data as any).username,
                    })
                );
            }
        }
    }

    function dropHandler(e: React.DragEvent<HTMLDivElement>) {
        e.stopPropagation();
        e.preventDefault();

        // FileList object.
        var files = e.dataTransfer.files;
        const uploadPhotos: JQuery<HTMLInputElement> = $("#uploadPhotos");
        readURL(files, uploadPhotos);
    }

    function dragoverHandler(e: React.DragEvent<HTMLDivElement>) {
        e.stopPropagation();
        e.preventDefault();
        // Explicitly show this is a copy.
        e.dataTransfer.dropEffect = "copy";
    }

    useEffect(() => {
        if (!loading && photos.length) {
            $("img.photo").each(function (index) {
                $(this).attr("data-index", index);
                $(this)
                    .siblings("div.photoAction")
                    .children("button.photo-action__btn")
                    .attr("data-index", index);
                $(this)
                    .siblings("div.photoAction")
                    .children("div.photo-action__div-hidden")
                    .children("ul")
                    .attr("data-index", index);
            });

            $("img.photo").each(function (index) {
                if (photos[index].name !== $(this).data("name")) {
                    const swapedIndex = photos.findIndex(
                        photo => photo.name === $(this).data("name")
                    );
                    let temp = photos[index];
                    photos[index] = photos[swapedIndex];
                    photos[swapedIndex] = temp;
                }
            });
        }
    }, [loading]);

    return (
        <>
            <div
                className='drag_n_drop_zone'
                onDragOverCapture={e => dragoverHandler(e)}
                onDrop={e => dropHandler(e)}
            >
                <div>
                    <Image src={getImage("/amentity_images/photos.svg")} size='64px' />
                </div>
                {/* <div className='photos__drag-title'>Kéo ảnh của bạn vào đây</div> */}
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <button className='photos__btn__load-images' id='triggerUploadPhotosInput'>
                        Tải lên từ thiết bị của bạn
                    </button>
                    <input
                        type='file'
                        name='room_photos'
                        id='uploadPhotos'
                        accept='images/*'
                        hidden
                        multiple
                    />
                </div>
            </div>
            <div id='editor' className='photosContainer'>
                <div className='flex-space' style={{ margin: "10px 0" }}>
                    <div>
                        <div
                            style={{
                                fontSize: "22px",
                                color: "#222",
                                fontWeight: "500",
                                lineHeight: "16px",
                            }}
                            id='addAtLeast5Images'
                        >
                            Chọn hình ảnh
                        </div>
                    </div>
                    <div>
                        <button className='upload__btn' onClick={uploadImagesToFolder}>
                            <Image src={getImage("/amentity_images/upload.svg")} size='22px' />
                            <span>Tải lên</span>
                        </button>
                    </div>
                </div>
                <div id='photosContainer__body'>
                    <div id='thumbnailPhotos'>
                        <div className='thumbnail-title'>Ảnh bìa</div>
                    </div>
                    <div id='subImages'></div>
                </div>
            </div>
        </>
    );
};

export default PropertyRoomImagesMainContent;
