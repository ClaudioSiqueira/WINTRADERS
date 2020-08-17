const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const database = require('./database')
const bcrypt = require('bcryptjs')
const session = require('express-session')



app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


// SESSION
app.use(session({
    secret:'qualquercoisa',
    cookie:{maxAge:3000000}
}))


/*
app.get('/gerarsession', (req, res) =>{
    req.session.autor = 'Juniki'
    req.session.criminoso = 'Megatronn'
    res.send('Session gerada')
})

app.get('/lersession', (req, res) =>{
    res.send([req.session.autor, req.session.criminoso])
})
*/


app.get('/', (req, res) =>{
    let nome = 'Login'
    if(req.session.user != undefined){
        nome = req.session.user.nome
    }
    
    database.select(['id','autor', 'nome', 'descricao']).table('criminosos').then(dados =>{
        res.render('index', {dados:dados, nome: nome})
        res.status(200)
    }).catch(err =>{
        console.log(err)
        res.sendStatus(400)
    })

})


app.get('/cadastrar',middleware, (req, res) =>{
    res.render('cadastrar')
})


app.post('/criminoso',middleware, (req, res) =>{
    let criminoso = req.body.criminoso
    let descricao = req.body.descricao

    let dados = {
        nome: criminoso,
        descricao: descricao,
        autor: req.session.user.nome
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

app.post('/criminoso/del/:id',middleware, (req, res) =>{
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



app.get('/criminoso/edit/:id',middleware, (req, res) =>{
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

app.post('/criminoso/update',middleware, (req, res) =>{
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


app.get('/login', (req, res) =>{
    res.render('login')
})

app.get('/new_user',middleware, (req, res) =>{
    res.render('new_user')
})

app.post('/criar/usuario',middleware, (req, res) =>{
    let nome = req.body.nome
    let password = req.body.password

    let salt = bcrypt.genSaltSync(10)
    let hash = bcrypt.hashSync(password, salt)

    if(nome != undefined && password != undefined){
        database.insert({nome:nome, password:hash}).table('admin').then(dados =>{
            res.redirect('/')
        }).catch(err =>{
            console.log(err)
            res.redirect('/new_user')
        })
    }else{
        res.redirect('/new_user')
    }
})

app.post('/authenticate', (req, res) =>{
    let nome = req.body.nome
    let senha = req.body.password
    
    database.where({nome:nome}).select().table('admin').then(data =>{
        let user = data[0]
        if(user != undefined){
            let correct = bcrypt.compareSync(senha, user.password)
            if(correct){
                req.session.user = {
                    id: user.id,
                    nome:user.nome
                }
                res.redirect('/')
            }else{
                res.redirect('/login')
            }

        }else{
            res.redirect('/login')
        }
        
    }).catch(err =>{
        res.redirect('/')
    })
})


app.get('/logout', (req, res) =>{
    req.session.user = undefined
    res.redirect('/')
})


function middleware(req, res, next){
    if(req.session.user != undefined){
        next()
    }else{
        res.redirect('/login')
    }
}

app.listen(9000, err =>{
    console.log('Servidor abriu !')
})