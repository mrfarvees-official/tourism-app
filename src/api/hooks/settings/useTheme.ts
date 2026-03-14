import { useEffect, useState } from "react";
import { updateTheme, getTheme } from "../../routes/settings/theme"; // Ensure `getTheme` is imported

export const useTheme = (tenantKey: string) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<string | null>(null); 
    const [result, setResult] = useState<any>(null); 
    const [payload, setPayload] = useState<any>(null);
    const [currentTheme, setCurrentTheme] = useState<any>(null); // State for the current theme

    // Fetch the current theme on component mount or tenantKey change
    useEffect(() => {
        const fetchCurrentTheme = async () => {
            setLoading(true); // Set loading state to true before making the request
            try {
                const themeResponse = await getTheme(tenantKey); // Fetch the current theme
                if (themeResponse) {
                    setCurrentTheme(themeResponse.data); // Set the current theme
                } else {
                    setErrors("Failed to load the current theme.");
                }
            } catch (error: any) {
                setErrors(error?.message || "Failed to load current theme.");
            } finally {
                setLoading(false); // Set loading to false once the request is complete
            }
        };

        if (tenantKey) {
            fetchCurrentTheme(); // Only fetch if tenantKey is available
        }
    }, [tenantKey]); // Only re-run when tenantKey changes

    // Update the theme when the payload changes
    useEffect(() => {
        if (!payload) return;

        const updateThemeAsync = async () => {
            setLoading(true); // Set loading state to true before making the request

            try {
                const response = await updateTheme(payload);
                setResult(response); // Set the result if the API call is successful
                setErrors(null); // Reset errors if the request is successful
            } catch (error: any) {
                // Log and show the error message if the request fails
                setErrors(error?.message || "Failed to update theme. Please try again.");
            } finally {
                setLoading(false); // Set loading to false once the request is complete
            }
        };

        updateThemeAsync(); // Call the async function to update the theme
    }, [payload]); // Run the effect when payload changes

    // Function to clear the state (useful if you need to reset the hook's state)
    const clearState = () => {
        setResult(null);
        setErrors(null);
        setLoading(false);
    };

    return { loading, errors, result, currentTheme, setPayload, clearState };
};
