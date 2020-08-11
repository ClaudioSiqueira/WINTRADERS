const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const database = require('./database')
const jwt = require('jsonwebtoken')
const cors = require('cors')

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) =>{
    database.select(['id','autor', 'nome', 'descricao']).table('criminosos').then(dados =>{
        res.render('index', {dados:dados})
        res.status(200)
    }).catch(err =>{
        console.log(err)
        res.sendStatus(400)
    })

})


app.get('/cadastrar', (req, res) =>{
    res.render('cadastrar')
})

app.get('/editar', (req, res) =>{
    res.render('editar')
})

app.post('/criminoso', (req, res) =>{
    let criminoso = req.body.criminoso
    let descricao = req.body.descricao

    let dados = {
        nome: criminoso,
        descricao: descricao,
        autor: 'teste'
    }

    if(criminoso != undefined){
        database.insert(dados).table('criminosos').then(dados =>{
            res.redirect('/')
            res.Status(200)
        }).catch(err =>{
            res.sendStatus(400)
            console.log(err)
        })
    }
})

app.post('/criminoso/del/:id', (req, res) =>{
    let id = req.params.id
    if(id != undefined){
        database.where({id: id}).delete().table('criminosos').then(dados =>{
            res.status(200)
            res.redirect('/')
        }).catch(err =>{
            res.sendStatus(400)
        })
    }
})


app.post('/criminoso/edit/:id', (req, res) =>{
    let id = req.params.id
    let nome = req.params.nome
    let descricao = req.params.descricao
    if(id != undefined){
        if(nome != undefined){
            database.where({id:id}).update({nome:nome}).table('criminosos').then(dados =>{
                res.redirect('/')
            }).catch(err =>{
                res.sendStatus(400)
            })
        }if(descricao != undefined){
            database.where({id: id}).update({descricao:descricao}).table('criminosos').then(dados =>{
                res.redirect('/')
            }).catch(err =>{
                res.sendStatus(400)
            })
        }
    }
})

app.listen(9000, err =>{
    console.log('Servidor abriu !')
})