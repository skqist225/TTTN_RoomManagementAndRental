import { FC } from "react";
import {
    LeftPageContent,
    PropertyRulesMainContent,
    RightPageContent,
} from "../../components/become_a_host";
import { Div } from "../../globalStyle";

interface IPropertyRulesPageProps {}

const PropertyRulesPage: FC<IPropertyRulesPageProps> = () => {
    return (
        <Div height='100vh'>
            <Div className='flex'>
                <LeftPageContent
                    background='/images/amentities.jpg'
                    title='Cho khách biết chỗ ở có những quy tắc gì?'
                />
                <RightPageContent
                    nextPage='preview'
                    prevPage='price'
                    MainContent={<PropertyRulesMainContent />}
                    stepNumber={10}
                />
            </Div>
        </Div>
    );
};

export default PropertyRulesPage;
