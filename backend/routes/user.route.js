
import { fetchUser, userLogin, userRegister, logout, updateUaer,  } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { validateEmail } from "../middleware/emailValidater.js";

//routes for users
export function userRoute(app){
    app.post('/api/register',validateEmail,userRegister);
    app.post('/api/login',userLogin);
    app.get('/api/user',verifyToken,fetchUser);
    app.post("/api/logout", logout);
    app.put("/api/user/:channelId",verifyToken,updateUaer);
  
    
}