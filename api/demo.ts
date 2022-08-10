import express from "express"

const router = express.Router()

router.get('/', (req, res)=>{
  res.send({
    data: "demo data"
  })
})

export default router
