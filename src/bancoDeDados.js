const uuidv4 = require('uuid/v4')


const pessoas = {
    "c863d826-5a35-49f2-a718-5c34250159d5": {
        "name": "Pessoa1",
        "id": "c863d826-5a35-49f2-a718-5c34250159d5"
    },
    "247cf236-dde0-4e04-a7e7-228c39dbe304": {
        "name": "Pessoa2",
        "id": "247cf236-dde0-4e04-a7e7-228c39dbe304"
    }
}

const receitas = {
    "10533b44-4fd2-40c5-9a8f-3d0fce7a94b8": {
        "value": 100,
        "note": "test coment",
        "person": {
            "id": "c863d826-5a35-49f2-a718-5c34250159d5"
        },
        "id": "10533b44-4fd2-40c5-9a8f-3d0fce7a94b8",
        "code": "10533B44",
        "date": "25/05/2018"
    },

    "18215298-ea37-4d5a-8757-b3b04f301209": {
        "value": 100,
        "note": "test coment 2",
        "person": {
            "id": "c863d826-5a35-49f2-a718-5c34250159d5"
        },
        "id": "18215298-ea37-4d5a-8757-b3b04f301209",
        "code": "18215298",
        "date": "25/05/2018"
    }
}

function salvarPessoa(pessoa) {
    if (!pessoa.id) pessoa.id = uuidv4()
    pessoas[pessoa.id] = pessoa
    return pessoa
}

function getPessoa(id) {
    return pessoas[id] || {}
}

function getPessoas() {
    return Object.values(pessoas)
}

function excluirPessoa(id) {
    const pessoa = pessoas[id]
    delete pessoas[id]
    return pessoa
}

function salvarReceita(receita) {
    if (!receita.id) {
        receita.id = uuidv4()
        receita.code = receita.id.substr(0, 8).toUpperCase()
    } 
    receitas[receita.id] = receita
    return receita
}

function getReceita(id) {
    return receitas[id] || {}
}

function getReceitas() {
    return Object.values(receitas)
}

function excluirReceita(id) {
    const receita = receitas[id]
    delete receitas[id]
    return receita
}


module.exports = {
    salvarPessoa, getPessoa, getPessoas, excluirPessoa, 
    salvarReceita, getReceita, getReceitas, excluirReceita
}