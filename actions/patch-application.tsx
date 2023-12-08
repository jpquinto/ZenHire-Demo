"use server";

import { Application } from "@/types";
import axios from "axios";

const URL = `${process.env.BACKEND_URL}/applications`;

const patchApplication = async (requestData: any, id: string): Promise<Application> => {
    const res = await axios.patch(`${URL}/${id}`, requestData);

    return res.data;
};

export default patchApplication;