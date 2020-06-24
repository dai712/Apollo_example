import jwt from 'jsonwebtoken';
/**
     * Signature algorithm. Could be one of these values :
     * - HS256:    HMAC using SHA-256 hash algorithm (default)
     * - HS384:    HMAC using SHA-384 hash algorithm
     * - HS512:    HMAC using SHA-512 hash algorithm
     * - RS256:    RSASSA using SHA-256 hash algorithm
     * - RS384:    RSASSA using SHA-384 hash algorithm
     * - RS512:    RSASSA using SHA-512 hash algorithm
     * - ES256:    ECDSA using P-256 curve and SHA-256 hash algorithm
     * - ES384:    ECDSA using P-384 curve and SHA-384 hash algorithm
     * - ES512:    ECDSA using P-521 curve and SHA-512 hash algorithm
     * - none:     No digital signature or MAC value included
*/ //나중에 다른것도 사용해볼것.
// {
//   "alg": "HS256",
//   "typ": "JWT"
// }


const tok = process.env.JWT_TOKEN!;
const accTokExpTime = 60       //10초
const refTokExpTime = 600         //10분

const createAccTok = (userID) => {
  let accToken = jwt.sign({
    data : userID
  }, tok, {expiresIn : 10})
  console.log("생성된 토큰" + accToken)
  
  return accToken.split(".");
}

const createRefTok = (accTok) => {
  let refToken = jwt.sign({
    data: accTok
  }, tok, {expiresIn: 10})
  console.log("생성된 리프레시" + refToken)

  return refToken.split(".")
}


export  { createAccTok, createRefTok }