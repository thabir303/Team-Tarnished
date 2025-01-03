import { Link } from "react-router-dom";
import image404 from "/404.jpg"

const ErrorPage = () => {
    return (
        <div className="h-screen flex justify-center items-center">
            <div className="text-center">
                <div className="w-full flex justify-center">
                <img className="w-2/6" src={image404} alt="" />
                </div>
                <Link to="/"><button className="btn">Go back to home</button></Link>
            </div>
        </div>
    );
};

export default ErrorPage;