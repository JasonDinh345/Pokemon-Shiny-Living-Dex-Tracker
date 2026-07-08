export default interface User{
    username: string,
    email: string,
    password: string | null,
    verified: boolean,
    googleID: string | null
}
