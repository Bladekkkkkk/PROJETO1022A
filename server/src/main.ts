import Express from "express";
import Cors from 'cors'
import ListaProdutos from "./lista-produtos";
import { basename } from "path";
import { log } from "console";
import { prependOnceListener } from "process";
import InserirProduto from "./inserir-produtos";

const app = Express()
app.use(Cors())
app.use(Express.json())

app.get("/produtos",async(req,res)=>{
    const listaProdutos = new ListaProdutos()
    res.send(await listaProdutos.execute())
})

app.post("/produtos",async(req,res)=>{
    console.log("Alguém tentou cadastrar produtos");
    console.log(req.body.id)
    const{id,nome,descricao,preco,imagem} = req.body
    const produto =  {
        id,
        nome,
        descricao,
        preco,
        imagem
    }
    const inserirProduto = new InserirProduto()
    try{
        const produtoInserido = inserirProduto.execute(produto)
        res.status(201).send(produtoInserido)
    }
    catch(e:any){
        if(e.code === 'ER_DUP_ENTRY'){
            console.log("Erro: Chave Primária Duplicada")
            res.status(400).send("Produto já cadastrado")
        }else{
            console.log(e)
            res.status(409).send("Erro Desconhecido: Olhe o TERMINAL do VCODE")
        }
    }
})

const porta = 8000
app.listen(porta,()=>{
    console.log("Server Rodando")
    console.log("digite: localhost:8000/produtos na url para acessar o servidor.")
})
