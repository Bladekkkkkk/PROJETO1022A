import mysql, { RowDataPacket } from 'mysql2/promise';
import 'dotenv/config'

type Output = {
    id:number,
    nome:string,
    idade:number,
    cpf:string,
    rg:string,
    endereco:string
    estado_civil:string
}

interface UsuarioRowDataPacket extends RowDataPacket{
    id:number,
    nome:string,
    idade:number,
    cpf:string,
    rg:string,
    endereco:string
    estado_civil:string
}
class ListaUsuarios{
    async execute(){
        try{
            const connection = await mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USUARIO,
                database: process.env.DB_BANCO,
            });

                const [rows, filds] =  await connection.query("SELECT * from usuarios");
                const dados = rows as UsuarioRowDataPacket[]
                const usuariosDoBanco:Output[] = []
                for( let linha of dados){
                    const {id,nome,idade,cpf,rg,endereco,estado_civil} = {...linha}
                    const usuarios = {
                        id,
                        nome,
                        idade,
                        cpf,
                        rg,
                        endereco,
                        estado_civil
                    }
                    usuariosDoBanco.push(usuarios)
                }
                return usuariosDoBanco
        }
        catch(e:any){
            if(e.code === 'ER_NO_SUCH_TABLE'){
                console.log("A tabela usuarios não foi criada, "
                +"Crie a tabela no workbench! :D");
            }else if(e.code==="ER_PARSE_ERROR"){
                console.log("Sua query está com algo errado:")
                console.log("Verifique: virgulas, pontos e nome de colunas.")
            }
            else if(e.code === 'ECONNREFUSED'){
                console.log("LIGAR O LARAGON!! MANÉ!");
            }else if(e.code === 'ER_BAD_DB_ERROR'){
                console.log("Deve criar o banco de DADOS {test}");
            }
            else{
                console.log("Erro ao conectar no banco",e);
            }
        }    
    }
}
export default ListaUsuarios