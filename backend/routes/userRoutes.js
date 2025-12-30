import express from 'express'
import {addUserRating, getUserData, purchaseCourse, userEnrolledCourses, updateUserCourseProgress, getUserCourseProgress} from '../controllers/userController.js'
import {protectRoute} from '../middlewares/authMiddleware.js'

const userRouter = express.Router()

userRouter.get('/data', protectRoute, getUserData)
userRouter.get('/enrolled-courses', protectRoute, userEnrolledCourses)
userRouter.post('/purchase', protectRoute, purchaseCourse)

userRouter.post("/update-course-progress", protectRoute, updateUserCourseProgress)
userRouter.post("/get-course-progress", protectRoute, getUserCourseProgress)
userRouter.post("/add-rating", protectRoute, addUserRating)

export default userRouter;