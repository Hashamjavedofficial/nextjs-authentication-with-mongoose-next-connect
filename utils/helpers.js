import jwt from 'jsonwebtoken'
export const generateToken = async (id)=>{
    let token;
    try {
        token = await jwt.sign(
            { id },
            'generatesecretecodeforthe@event@/app'
        );
        return token
    } catch (error) {
       throw new Error('Something went wrong, try again later')
    }
}