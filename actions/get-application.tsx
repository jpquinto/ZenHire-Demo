import { Application } from "@/types";
import axios from "axios";

const URL = `${process.env.BACKEND_URL}/applications`;

const getApplication = async (id: string): Promise<Application> => {
    const res = await axios.get(`${URL}/${id}`);

    return res.data;
};

export default getApplication;