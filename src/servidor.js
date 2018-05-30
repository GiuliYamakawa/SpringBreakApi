const porta = 3003

const express = require('express')
const servidor = express()
const bodyParser = require('body-parser')
const bancoDeDados = require('./bancoDeDados')
const moment = require('moment')

servidor.use(bodyParser.json({extended: true}))

servidor.post('/pessoas', (req, res, next) => {
    let name = req.body.name
    let pessoa = {name: name}
    if (!name) {
        res.status(422).send('Name é obrigatório!');
    } if (name.length > 80) {
        res.status(422).send('nome tem mais de 80 caracteres');
    } else {
        let pessoaSalva = bancoDeDados.salvarPessoa(pessoa)
        res.status(201)
        res.send(pessoaSalva.id)
    }
})

servidor.get('/pessoas', (req, res, next) => {
    res.send(bancoDeDados.getPessoas())
})

servidor.get('/pessoas/:id', (req, res, next) => {
    let id = req.params.id
    let pessoa = bancoDeDados.getPessoa(id)
    res.send(pessoa)
})

servidor.put('/pessoas/:id', (req, res, next) => {
    let id = req.params.id
    let name = req.body.name
    let pessoa = {id: id, name: name}
    if (!name) {
        res.status(422).send('Name é obrigatório');
    } if (name.length > 80) {
        res.status(422).send('nome tem mais de 80 caracteres');
    } else {
        bancoDeDados.salvarPessoa(pessoa)
        res.status(204)
        res.send()
    }
})

servidor.delete('/pessoas/:id', (req, res, next) => {
    let id = req.params.id
    const pessoa = bancoDeDados.excluirPessoa(id)
    res.send(pessoa)
})


servidor.post('/receitas', (req, res, next) => {
    let value = req.body.value
    let note = req.body.note
    let date = req.body.date
    let convertDate = moment(date, 'DD/MM/YYYY', true)
    let person = req.body.person
    let today = new Date();
    let receita = {value: value, note: note, date: convertDate, person: person}
    if (note && note.length > 255) {
        res.status(422).send('note tem mais de 255 caracteres');
    } if (!value) {
        res.status(422).send('Value é obrigatório');
    } if (value < 0) {
        res.status(422).send('Value deve ser positivo');
    } if (!person) {
        res.status(422).send('Person é obrigatório');
    } if (!date) {
        res.status(422).send('Date é obrigatório');
    } if (convertDate.toDate().getTime() > today.getTime()) {
        res.status(422).send('Date não pode ser uma data futura');
    } if (!convertDate.isValid()) {
        res.status(422).send('Date está com formato errado');
    } else {
        receita.value = receita.value.toFixed(2)
        receita.value = parseFloat(receita.value)
        receita.date = moment(receita.date).format('DD/MM/YYYY')
        let receitaSalva = bancoDeDados.salvarReceita(receita)
        res.status(201)
        res.send(receitaSalva.id)
    }
})

servidor.get('/receitas', (req, res, next) => {
    let receitas = bancoDeDados.getReceitas()
    receitas = receitas.map(function(elemento) {
        let person = bancoDeDados.getPessoa(elemento.person.id)
        elemento.person = person
        return elemento
    })
    res.send(receitas)
})

servidor.get('/receitas/:id', (req, res, next) => {
    let id = req.params.id
    let receita = bancoDeDados.getReceita(id)
    let person = bancoDeDados.getPessoa(receita.person.id)
    receita.person = person
    res.send(receita)
})

servidor.delete('/receitas/:id', (req, res, next) => {
    let id = req.params.id
    const receita = bancoDeDados.excluirReceita(id)
    res.send(receita)
})

servidor.put('/receitas/:id', (req, res, next) => {
    let id = req.params.id
    let retorno = bancoDeDados.getReceita(id)
    let value = req.body.value
    let date = req.body.date
    let convertDate = moment(date, 'DD/MM/YYYY', true)
    let note = req.body.note
    let person = req.body.person
    let today = new Date();
    let receita = {id: id, code: retorno.code, value: value, note: note, date: convertDate,  person: person}
    if (note && note.length > 255) {
        res.status(422).send('note tem mais de 255 caracteres');
    } if (value < 0) {
        res.status(422).send('Value deve ser positivo');
    } if (!value) {
        res.status(422).send('Value é obrigatório');
    } if (!person) {
        res.status(422).send('Person é obrigatório');
    } if (!date) {
        res.status(422).send('Date é obrigatório!');
    } if (convertDate.toDate().getTime() > today.getTime()) {
        res.status(422).send('Date não pode ser uma data futura');
    } if (!convertDate.isValid()) {
        res.status(422).send('Date está com formato errado');
    } else {
        receita.value = receita.value.toFixed(2)
        receita.date = moment(receita.date).format('DD/MM/YYYY')
        bancoDeDados.salvarReceita(receita)
        res.status(204)
        res.send()
    }
})

servidor.get('/howMuchDoWeHave', (req, res, next) => {
    let receitas = bancoDeDados.getReceitas()
    let total = 0
    let today = new Date();
    receitas.forEach(function(elemento) {
        let value = elemento.value
        totalDias = today.getTime() - moment(elemento.date, 'DD/MM/YYYY').toDate().getTime()
        let duration = moment.duration(totalDias, 'milliseconds');
        let days = Math.floor(duration.asDays());
        let juros = 0.01
        let calculo = value * (Math.pow(1 + juros, days))
        total = calculo + total
    })
    res.send({total: `R$ ${total.toFixed(2).replace('.', ',')}`})
})

servidor.get('/areWeGoingToSpring', (req, res, next) => {
    let receitas = bancoDeDados.getReceitas()
    let total = 0
    let today = new Date();
    let dataLimite = moment('01/03/2019', 'DD/MM/YYYY')
    let totalAmigos = bancoDeDados.getPessoas().length
    let valorObjetivo = totalAmigos * 10000
    console.log(totalAmigos)
    receitas.forEach(function(elemento) {
        let value = elemento.value
        totalDias = dataLimite.toDate().getTime() - today.getTime()
        let duration = moment.duration(totalDias, 'milliseconds');
        let days = Math.floor(duration.asDays());
        let juros = 0.01
        let calculo = value * (Math.pow(1 + juros, days))
        total = calculo + total
    })
    if (total > valorObjetivo) {
        res.send(true)
    } else {
        res.send(false)
    }
})



servidor.listen(porta, () => {
    console.log(`O servidor está executando na porta ${porta}`)
})
