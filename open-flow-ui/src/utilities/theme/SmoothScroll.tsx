// import { useEffect } from 'react';
// import { useLocation, useNavigationType } from 'react-router-dom';

export const navToTop = () => {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
};

const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
    // const location = useLocation();
    // const navType = useNavigationType();

    // useEffect(() => {
    //     if (navType !== "POP") navToTop();
    // }, [location]);

    return children;
};

export default SmoothScroll;