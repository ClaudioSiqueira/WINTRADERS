const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const database = require('./database')

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.get('/', (req, res) =>{
    res.render('index')
})

app.post('/criminoso', (req, res) =>{
    let autor = req.body.autor
    let criminoso = req.body.criminoso
    let descricao = req.body.descricao

    let dados = {
        nome: criminoso,
        descricao: descricao,
        autor: autor
    }

    if(autor != undefined && criminoso != undefined){
        database.insert(dados).table('criminosos').then(dados =>{
            res.sendStatus(200)
            res.redirect('/')
        }).catch(err =>{
            res.sendStatus(400)
            console.log(err)
        })
    }
})


app.listen(9000, err =>{
    console.log('Servidor abriu !')
})