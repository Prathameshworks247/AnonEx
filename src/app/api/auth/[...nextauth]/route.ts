import nextAuth from "next-auth";
import { authoptions } from "./options";

const handler = nextAuth(authoptions);

export {handler as GET , handler as POST};

