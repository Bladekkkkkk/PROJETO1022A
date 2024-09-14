import { expect , test , beforeAll , afterAll } from 'vitest'
import mysql from 'mysql2/promise'
import 'dotenv/config'
import ListaUsuarios from './lista-usuarios';
import InserirUsuarios from './inserir-usuarios';

afterAll(async()=>{
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USUARIO,
        database: process.env.DB_BANCO,
    });
    await connection.query("DELETE FROM usuarios");
})
test("Deve inserir um usuario no banco de dados",async()=>{
    //GIVEN
    const usuarioParaInserir = {
        id:2,
        nome:"Pedro",
        idade:19,
        cpf:"031.642.161-13",
        rg:"001.987.283",
        endereco:"Rua Piauí, Centro, Número 69, Naviraí - MS",
        estado_civil:"casado"
       
    }
    //WHEN
    const inserirUsuarios = new InserirUsuarios()
    const usuarioBanco = await inserirUsuarios.execute(usuarioParaInserir)
    //THEN
    expect(usuarioBanco).toStrictEqual(usuarioParaInserir)
    const listaUsuarios = new ListaUsuarios()
    const usuarios = await listaUsuarios.execute()
    expect(usuarios).toContainEqual(usuarioParaInserir)

})