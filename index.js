const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const database = require('./database')
const bcrypt = require('bcryptjs')



app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


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



app.get('/criminoso/edit/:id', (req, res) =>{
    let id = req.params.id
    if(id != undefined){
        database.select().where({id:id}).table('criminosos').then(data =>{
            res.render('editar',{data:data[0]})
        }).catch(err =>{
            res.redirect('/')
        })
    }else{
        res.redirect('/')
    }
})

app.post('/criminoso/update', (req, res) =>{
    let nome = req.body.criminoso
    let descricao = req.body.descricao
    let id = req.body.id
    
    if(id != undefined){
        if(nome != undefined){
            database.where({id:id}).update({nome:nome}).table('criminosos').then(data =>{
                res.redirect('/')
            }).catch(err =>{
                res.redirect('/')
            })
        }
        if(descricao != undefined){
            database.where({id:id}).update({descricao:descricao}).table('criminosos').then(data =>{
                res.redirect('/')
            }).catch(err =>{
                res.redirect('/')
            })
        }

    }else{
        res.redirect('/')
    }
})

app.get('/new_user', (req, res) =>{
    res.render('new_user')
})

app.post('/criar/usuario', (req, res) =>{
    let nome = req.body.nome
    let password = req.body.password
    if(nome != undefined && password != undefined){
        database.insert({nome:nome, password:password}).table('admin').then(dados =>{
            res.redirect('/')
        }).catch(err =>{
            res.redirect('/new_user')
        })
    }else{
        res.redirect('/new_user')
    }
})

app.post('/authenticate', (req, res) =>{
    let nome = req.body.nome
    let senha = req.body.senha
    res.send({nome:nome, senha:senha})
    
})

app.listen(9000, err =>{
    console.log('Servidor abriu !')
})