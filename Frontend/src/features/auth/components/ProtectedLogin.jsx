import React, { useContext } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router'
import { AuthContext } from '../auth.context'

const ProtectedLogin = ({children}) => {
    const {user, loading} = useContext(AuthContext)

    if(!user){
        return children
    }

    return <Navigate to={"/"}/>
}

export default ProtectedLogin