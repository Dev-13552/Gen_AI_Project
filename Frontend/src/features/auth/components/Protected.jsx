import { useAuth } from "../hooks/useAuth";
import { Navigate, useParams } from "react-router";
import React, { useEffect } from "react";
import Login from "../pages/Login";
import { getMe } from "../services/auth.api.js";
import Loader from "./Loader.jsx";

const Protected = ({ children }) => {
  const { loading, user } = useAuth();
  console.log(user);

  if (loading) {
    return (
      <main>
        <Loader loading={loading}/>
      </main>
    );
  }

  if (!user) {
    return <Navigate to={"/login"} />;
  }

  return children;
};

export default Protected;
