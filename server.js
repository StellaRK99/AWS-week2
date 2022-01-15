const express = require('express')
const app = express()
const multer = require('multer')
const upload = multer({dest: 'images/'})
app.use('/images', express.static('images'))
const fs = require('fs')
const PORT = 8080

app.post('/api/images', upload.single('image'), (req, res) => {
    
    const imagePath = req.file.path
    const description = req.body.description

    console.log(description, imagePath)

    res.send({description, imagePath}).sendStatus(200)
})

app.get('/images/:imageName', (req, res) => {
    const imageName = req.params.imageName
    const readStream = fs.createReadStream(`images/${imageName}`)
    readStream.pipe(res)

})

app.listen(PORT, ()=> console.log(`app listening at port ${PORT}`))