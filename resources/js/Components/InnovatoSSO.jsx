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
        verifyAuth();

        const script = document.createElement("script");
        script.src = "https://dtr.iits.website/SSO/v1/SSO.js";
        script.async = true;
        script.onload = () => {
            const clientId = import.meta.env.VITE_SSO_CLIENT_ID;

            const sso = new InnovatoSSOv1({
                clientId: clientId,
                redirectUri:
                    import.meta.env.VITE_SSO_REDIRECT_URI ||
                    `${window.location.origin}/sso/callback`,
                container: "innovato-sso-button",
                theme: "light",
                size: "normal",
                baseUrl: "https://dtr.iits.website",
            });
            sso.login()
                .then((response) => {
                    console.log("Login successful:", response);
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
