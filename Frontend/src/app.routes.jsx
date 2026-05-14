import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";
import Profile from "./features/auth/pages/Profile";
import ProtectedLogin from "./features/auth/components/ProtectedLogin";
import Verify from "./features/auth/pages/Verify";
import VerifyEmail from "./features/auth/pages/VerifyEmail";
import Reverify from "./features/auth/pages/Reverify";


export const router = createBrowserRouter([
    {
        path: "/login",
        element: <><Login /></>
    },
    {
        path: "/register",
        element: <><Register /></>
    },
    {
        path: "/reverify",
        element: <><Reverify /></>
    },
    {
        path: "/",
        element: <Protected><Home /></Protected>
    },
    {
        path:"/interview/:interviewId",
        element: <Protected><Interview /></Protected>
    },
    {
        path:"/user/:id",
        element: <Protected><Profile /></Protected>
    },
    {
        path:"/verify",
        element: <><Verify /></>
    },
    {
        path:"/verify/:token",
        element: <><VerifyEmail /></>
    },
])