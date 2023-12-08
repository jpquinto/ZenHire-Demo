"use server";

import { Application } from "@/types";
import axios from "axios";

const URL = `${process.env.BACKEND_URL}/applications`;

const postApplication = async (requestData: any): Promise<Application> => {
    const res = await axios.post(`${URL}`, requestData);

    return res.data;
};

export default postApplication;