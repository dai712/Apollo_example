import jwt from 'jsonwebtoken';


const tok = "&YK#t!XQDuN&2wSWcd53kDa-!w8BAjuAL34bdyYe^^D52r6eeYtXLK%yvn5ZuAPKc6^K9ewMz";
const varTime = '15m';

const createJWT = (user) => {
  let token = jwt.sign({
    user
  }, tok)
  let tokenArr = token.split('.')
  return tokenArr;
}


export default createJWT