import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const { data } = await axios.get('/user/registered/getDetails');
            if (data.data && data.data.role === 'admin') {
                setAdmin(data.data);
            } else {
                setAdmin(null);
            }
        } catch (error) {
            setAdmin(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ admin, setAdmin, loading, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};
