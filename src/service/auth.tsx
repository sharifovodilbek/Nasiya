import { instance } from "../hooks/instance";

export const Login = (data: { name: string, password: string }, setCookies: any) => {
    return instance.post("/seller/login", data).then(res => {
        setCookies("accessToken", res.data.token, { path: '/' }) 
        return res.data;
    })
}
