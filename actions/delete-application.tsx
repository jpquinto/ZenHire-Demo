"use server";

import { Application } from "@/types";
import axios from "axios";

const URL = `${process.env.BACKEND_URL}/applications`;

const deleteApplication = async (id: string): Promise<Application> => {
    const res = await axios.delete(`${URL}/${id}`);

    return res.data;
};

export default deleteApplication;