import { csrf, http } from "../../config/http";

export const updateTheme = async (payload: any) => {
    try {
        await csrf();
        const result = await http.patch('api/company/bootstrap/theme', payload);
        
        if (result.data) {
            return result;
        }

        return false;
    } catch (err: any) {
        throw new Error(err);
    }
}

export const getTheme = async (tenantKey: any) => {
    try {
        const result = await http.get(`api/company/bootstrap/theme?tenantKey=${tenantKey}`);

        if (result.data) {
            return result;
        }
        
        return false;
    } catch (err: any) {
        throw new Error(err);
    }
}