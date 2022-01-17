require('dotenv').config()

const express = require('express')
const app = express()
const multer = require('multer')
const path = require("path")
const upload = multer({dest: 'images/'})
const database = require('./database/database')
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded())
app.use(express.static(path.join(__dirname, "build")))

const fs = require('fs')


app.get('/', (req, res) => {
    res.send("Welcome to the backdoor ;)")
})

app.get('/api/images', async (req, res) => {
    try{
        const images = await database.getImages()
        res.status(200).send({images: images})
    }
    catch(error){
        console.error(error)
        res.sendStatus(500)
    }
})
//FIX THIS AND GET ID FOR EACH IMAGE
app.get('/images/:imageName', async (req, res) => {
    const imageName = req.params.imageName
    const readStream = fs.createReadStream(`images/${imageName}`)
    try{
        readStream.pipe(res)
    }
    catch(error){
        console.error(error)
        res.sendStatus(500)
    }
})

app.post('/api/images', upload.single('image'), async (req, res) => {
    const imagePath = req.file.path
    const description = req.body.description
    try{
        const image = await database.addImage(imagePath, description) 
        res.status(200).send({image})
    }
    catch(error){
        console.error(error)
        res.sendStatus(500)
    }
})

// app.use('/images', express.static('images'))


app.listen(process.env.PORT, ()=> console.log(`app listening at port ${process.env.PORT}`))