import { useEffect } from "react";
import { router } from "@inertiajs/react";
import axios from "axios";

export default function InnovatoSSO() {
    const verifyAuth = async () => {
        try {
            await axios.get("/sso/verify");
            router.visit("/dashboard");
        } catch (error) {
            // User not authenticated, continue with SSO button
            return false;
        }
    };

    const handleAuthentication = async (authData) => {
        try {
            // Use Inertia form submission to handle redirect
            router.post("/sso/authenticate", authData);
        } catch (error) {
            console.error("Authentication failed:", error);
        }
    };

    useEffect(() => {
        // Check if user is already authenticated
        verifyAuth();

        // Load SSO script
        const script = document.createElement("script");
        script.src = "http://127.0.0.1:8000/SSO/v1/SSO.js";
        script.async = true;
        script.onload = () => {
            const sso = new InnovatoSSOv1({
                clientId: "NsdfN5VNWEAtcncHpmpaa7D5BplAqH5y",
                redirectUri: window.location.origin + "/v1/sso/login",
                container: "innovato-sso-button",
                theme: "light",
                size: "normal",
            });

            sso.login()
                .then((response) => {
                    handleAuthentication(response);
                })
                .catch((error) => {
                    console.error("Login failed:", error);
                });
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return <div id="innovato-sso-button"></div>;
}
