import { FC } from "react";
import {
    LeftPageContent,
    RightPageContent,
    RoomPreviewMainContent,
} from "../../components/become_a_host";
import { Div } from "../../globalStyle";

interface IRoomPreviewPageProps {}

const RoomPreviewPage: FC<IRoomPreviewPageProps> = () => {
    return (
        <Div height='100vh'>
            <Div className='flex'>
                <LeftPageContent
                    background='/images/preview.jpg'
                    title='Bước cuối trước khi bạn trở thành chủ nhà'
                />
                <RightPageContent
                    nextPage='publish-celebration'
                    prevPage='rule'
                    MainContent={<RoomPreviewMainContent />}
                    stepNumber={11}
                />
            </Div>
        </Div>
    );
};

export default RoomPreviewPage;
