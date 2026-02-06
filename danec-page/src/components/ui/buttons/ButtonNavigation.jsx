import { useNavigate } from "react-router-dom";

export const ButtonNavigate = ({
    linkPage = "/",
    text = "IR",
    className = ""
}) => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(linkPage)}
            className={`px-4 py-2 bg-main rounded-2xl text-white w-fit text-xl font-[700] cursor-pointer ${className}`}
        >
            {text}
        </button>
    );
};
