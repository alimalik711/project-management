import api from "./api";

export const getDashboard = async () => {

    
    const response = await api.get("/dashboard");
    console.log("my response is");
    console.log(response);

    return response.data;

};