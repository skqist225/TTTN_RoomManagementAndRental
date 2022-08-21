interface ISVG {
    height: string;
    width: string;
}

export const FacebookLogo = ({height, width}: ISVG) => {
    return (
        <svg
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
            role='presentation'
            aria-hidden='true'
            focusable='false'
            width={width}
            height={height}
            style={{display: 'block', fill: 'currentcolor'}}
        >
            <defs>
                <path id='a' d='M.001 0H24v23.854H.001z'></path>
            </defs>
            <g fill='none' fillRule='evenodd'>
                <mask id='b' fill='#fff'>
                    <use href='#a'></use>
                </mask>
                <path
                    d='M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V15.47H7.078V12h3.047V9.356c0-3.007 1.792-4.668 4.533-4.668 1.312 0 2.686.234 2.686.234v2.953H15.83c-1.491 0-1.956.925-1.956 1.874V12h3.328l-.532 3.469h-2.796v8.385C19.612 22.954 24 17.99 24 12'
                    fill='#1877F2'
                    mask='url(#b)'
                ></path>
                <path
                    d='M16.671 15.469L17.203 12h-3.328V9.749c0-.949.465-1.874 1.956-1.874h1.513V4.922s-1.374-.234-2.686-.234c-2.741 0-4.533 1.66-4.533 4.668V12H7.078v3.469h3.047v8.385a12.09 12.09 0 003.75 0V15.47h2.796'
                    fill='#FFF'
                ></path>
            </g>
        </svg>
    );
};

export const GoogleLogo = ({height, width}: ISVG) => {
    return (
        <svg
            viewBox='0 0 18 18'
            role='presentation'
            aria-hidden='true'
            focusable='false'
            width={width}
            height={height}
            style={{display: 'block', fill: 'currentcolor'}}
        >
            <g fill='none' fillRule='evenodd'>
                <path
                    d='M9 3.48c1.69 0 2.83.73 3.48 1.34l2.54-2.48C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.91 2.26C4.6 5.05 6.62 3.48 9 3.48z'
                    fill='#EA4335'
                ></path>
                <path
                    d='M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.1.83-.64 2.08-1.84 2.92l2.84 2.2c1.7-1.57 2.68-3.88 2.68-6.62z'
                    fill='#4285F4'
                ></path>
                <path
                    d='M3.88 10.78A5.54 5.54 0 0 1 3.58 9c0-.62.11-1.22.29-1.78L.96 4.96A9.008 9.008 0 0 0 0 9c0 1.45.35 2.82.96 4.04l2.92-2.26z'
                    fill='#FBBC05'
                ></path>
                <path
                    d='M9 18c2.43 0 4.47-.8 5.96-2.18l-2.84-2.2c-.76.53-1.78.9-3.12.9-2.38 0-4.4-1.57-5.12-3.74L.97 13.04C2.45 15.98 5.48 18 9 18z'
                    fill='#34A853'
                ></path>
                <path d='M0 0h18v18H0V0z'></path>
            </g>
        </svg>
    );
};
// @ts-ignore
export const ProductIcon = ({className, ...restProps}) => {
    return (
        <svg
            enableBackground="new 0 0 15 15"
            viewBox="0 0 15 15"
            x="0"
            y="0"
            strokeWidth="0"
            className={className}
            {...restProps}
        >
            <path
                d="m13 1.9c-.2-.5-.8-1-1.4-1h-8.4c-.6.1-1.2.5-1.4 1l-1.4 4.3c0 .8.3 1.6.9 2.1v4.8c0 .6.5 1 1.1 1h10.2c.6 0 1.1-.5 1.1-1v-4.6c.6-.4.9-1.2.9-2.3zm-11.4 3.4 1-3c .1-.2.4-.4.6-.4h8.3c.3 0 .5.2.6.4l1 3zm .6 3.5h.4c.7 0 1.4-.3 1.8-.8.4.5.9.8 1.5.8.7 0 1.3-.5 1.5-.8.2.3.8.8 1.5.8.6 0 1.1-.3 1.5-.8.4.5 1.1.8 1.7.8h.4v3.9c0 .1 0 .2-.1.3s-.2.1-.3.1h-9.5c-.1 0-.2 0-.3-.1s-.1-.2-.1-.3zm8.8-1.7h-1v .1s0 .3-.2.6c-.2.1-.5.2-.9.2-.3 0-.6-.1-.8-.3-.2-.3-.2-.6-.2-.6v-.1h-1v .1s0 .3-.2.5c-.2.3-.5.4-.8.4-1 0-1-.8-1-.8h-1c0 .8-.7.8-1.3.8s-1.1-1-1.2-1.7h12.1c0 .2-.1.9-.5 1.4-.2.2-.5.3-.8.3-1.2 0-1.2-.8-1.2-.9z"></path>
        </svg>
    );
};
// @ts-ignore
export const FollowingIcon = ({className}) => {
    return (
        <svg enableBackground="new 0 0 15 15" viewBox="0 0 15 15" x="0" y="0" className={className}>
            <g>
                <circle cx="7" cy="4.5" fill="none" r="3.8" strokeMiterlimit="10"></circle>
                <line
                    fill="none"
                    strokeLinecap="round"
                    strokeMiterlimit="10"
                    x1="12"
                    x2="12"
                    y1="11.2"
                    y2="14.2"
                ></line>
                <line
                    fill="none"
                    strokeLinecap="round"
                    strokeMiterlimit="10"
                    x1="10.5"
                    x2="13.5"
                    y1="12.8"
                    y2="12.8"
                ></line>
                <path
                    d="m1.5 13.8c0-3 2.5-5.5 5.5-5.5 1.5 0 2.9.6 3.9 1.6"
                    fill="none"
                    strokeLinecap="round"
                    strokeMiterlimit="10"
                ></path>
            </g>
        </svg>
    );
};
// @ts-ignore
export const ChatIcon = ({className, fill, ...restProps}) => (
    <svg
        enableBackground="new 0 0 15 15"
        viewBox="0 0 15 15"
        x="0"
        y="0"
        className={className}
        fill={fill}
        {...restProps}
    >
        <g>
            <polygon
                fill={fill}
                points="14 10.8 7 10.8 3 13.8 3 10.8 1 10.8 1 1.2 14 1.2"
                strokeLinejoin="round"
                strokeMiterlimit="10"
            ></polygon>
            <circle cx="4" cy="5.8" r="1" stroke="none"></circle>
            <circle cx="7.5" cy="5.8" r="1" stroke="none"></circle>
            <circle cx="11" cy="5.8" r="1" stroke="none"></circle>
        </g>
    </svg>
);
// @ts-ignore
export const FollowerIcon = ({className}) => {
    return (
        <svg enableBackground="new 0 0 15 15" viewBox="0 0 15 15" x="0" y="0" className={className}>
            <g>
                <circle cx="5.5" cy="5" fill="none" r="4" strokeMiterlimit="10"></circle>
                <path
                    d="m8.4 7.5c.7 0 1.1.7 1.1 1.6v4.9h-8v-4.9c0-.9.4-1.6 1.1-1.6"
                    fill="none"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                ></path>
                <path
                    d="m12.6 6.9c.7 0 .9.6.9 1.2v5.7h-2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                ></path>
                <path
                    d="m9.5 1.2c1.9 0 3.5 1.6 3.5 3.5 0 1.4-.9 2.7-2.1 3.2"
                    fill="none"
                    strokeLinecap="round"
                    strokeMiterlimit="10"
                ></path>
            </g>
        </svg>
    );
};
// @ts-ignore
export const StarIcon = ({stroke, fillColor, ...restProps}) => (
    <svg enableBackground="new 0 0 15 15" viewBox="0 0 15 15" x="0" y="0" {...restProps}>
        <polygon
            fill={fillColor}
            points="7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeMiterlimit="10"
            stroke={stroke}
        ></polygon>
    </svg>
);
// @ts-ignore
export const AskIcon = ({width, height, fillColor, stroke, className, ...props}) => (
    <svg
        enableBackground="new 0 0 15 15"
        viewBox="0 0 15 15"
        className={className}
        width={width}
        height={height}
        fill={fillColor}
        {...props}
    >
        <circle
            cx="7.5"
            cy="7.5"
            fill="none"
            r="6.5"
            strokeMiterlimit="10"
            stroke={stroke}
        ></circle>
        <path
            stroke="none"
            d="m5.3 5.3c.1-.3.3-.6.5-.8s.4-.4.7-.5.6-.2 1-.2c.3 0 .6 0 .9.1s.5.2.7.4.4.4.5.7.2.6.2.9c0 .2 0 .4-.1.6s-.1.3-.2.5c-.1.1-.2.2-.3.3-.1.2-.2.3-.4.4-.1.1-.2.2-.3.3s-.2.2-.3.4c-.1.1-.1.2-.2.4s-.1.3-.1.5v.4h-.9v-.5c0-.3.1-.6.2-.8s.2-.4.3-.5c.2-.2.3-.3.5-.5.1-.1.3-.3.4-.4.1-.2.2-.3.3-.5s.1-.4.1-.7c0-.4-.2-.7-.4-.9s-.5-.3-.9-.3c-.3 0-.5 0-.7.1-.1.1-.3.2-.4.4-.1.1-.2.3-.3.5 0 .2-.1.5-.1.7h-.9c0-.3.1-.7.2-1zm2.8 5.1v1.2h-1.2v-1.2z"
        ></path>
    </svg>
);

export const VCT = ({...props}) => (
    <svg
        enableBackground="new 0 0 15 15"
        viewBox="0 0 15 15"
        x="0"
        y="0"
        className="shopee-svg-icon icon-free-shipping-line"
        {...props}
    >
        <g>
            <line
                fill="none"
                strokeLinejoin="round"
                strokeMiterlimit="10"
                x1="8.6"
                x2="4.2"
                y1="9.8"
                y2="9.8"
            ></line>
            <circle cx="3" cy="11.2" fill="none" r="2" strokeMiterlimit="10"></circle>
            <circle cx="10" cy="11.2" fill="none" r="2" strokeMiterlimit="10"></circle>
            <line fill="none" strokeMiterlimit="10" x1="10.5" x2="14.4" y1="7.3" y2="7.3"></line>
            <polyline
                fill="none"
                points="1.5 9.8 .5 9.8 .5 1.8 10 1.8 10 9.1"
                strokeLinejoin="round"
                strokeMiterlimit="10"
            ></polyline>
            <polyline
                fill="none"
                points="9.9 3.8 14 3.8 14.5 10.2 11.9 10.2"
                strokeLinejoin="round"
                strokeMiterlimit="10"
            ></polyline>
        </g>
    </svg>
);
// @ts-ignore
export const ChatIcon2 = ({fill, width, height}) => (
    <svg
        viewBox="0 0 16 16"
        fill={fill}
        width={width}
        height={height}
        style={{cursor: 'pointer'}}
    >
        <g fillRule="evenodd">
            <path
                d="M15 4a1 1 0 01.993.883L16 5v9.932a.5.5 0 01-.82.385l-2.061-1.718-8.199.001a1 1 0 01-.98-.8l-.016-.117-.108-1.284 8.058.001a2 2 0 001.976-1.692l.018-.155L14.293 4H15zm-2.48-4a1 1 0 011 1l-.003.077-.646 8.4a1 1 0 01-.997.923l-8.994-.001-2.06 1.718a.5.5 0 01-.233.108l-.087.007a.5.5 0 01-.492-.41L0 11.732V1a1 1 0 011-1h11.52zM3.646 4.246a.5.5 0 000 .708c.305.304.694.526 1.146.682A4.936 4.936 0 006.4 5.9c.464 0 1.02-.062 1.608-.264.452-.156.841-.378 1.146-.682a.5.5 0 10-.708-.708c-.185.186-.445.335-.764.444a4.004 4.004 0 01-2.564 0c-.319-.11-.579-.258-.764-.444a.5.5 0 00-.708 0z"></path>
        </g>
    </svg>
);

// @ts-ignore
export const DropDownIcon = ({className, ...restProps}) => (
    <svg viewBox="0 0 10 6" className={className} {...restProps}>
        <path
            d="M9.7503478 1.37413402L5.3649665 5.78112957c-.1947815.19574157-.511363.19651982-.7071046.00173827a.50153763.50153763 0 0 1-.0008702-.00086807L.2050664 1.33007451l.0007126-.00071253C.077901 1.18820749 0 1.0009341 0 .79546595 0 .35614224.3561422 0 .7954659 0c.2054682 0 .3927416.07790103.5338961.20577896l.0006632-.00066318.0226101.02261012a.80128317.80128317 0 0 1 .0105706.0105706l3.3619016 3.36190165c.1562097.15620972.4094757.15620972.5656855 0a.42598723.42598723 0 0 0 .0006944-.00069616L8.6678481.20650022l.0009529.0009482C8.8101657.07857935 8.9981733 0 9.2045341 0 9.6438578 0 10 .35614224 10 .79546595c0 .20495443-.077512.39180497-.2048207.53283641l.0003896.00038772-.0096728.00972053a.80044712.80044712 0 0 1-.0355483.03572341z"
            fillRule="nonzero"
        ></path>
    </svg>
);