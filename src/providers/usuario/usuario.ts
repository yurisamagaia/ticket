import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../database/database';

@Injectable()
export class UsuarioProvider {

  constructor(private dbProvider: DatabaseProvider) { }

  public insert(usuario: Usuario) {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = 'INSERT INTO usuario (nome, senha, ativo) VALUES (?, ?, ?)';
      let data = [usuario.nome.toUpperCase(), usuario.senha, usuario.ativo ? 1 : 0];
      return db.executeSql(sql, data).catch((e) => console.error(e));
    }).catch((e) => console.error(e));
  }

  public update(usuario: Usuario) {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = 'UPDATE usuario SET nome = ?, ativo = ? where id = ?';
      let data = [usuario.nome.toUpperCase(), usuario.ativo ? 1 : 0, usuario.id];
      return db.executeSql(sql, data).catch((e) => console.error(e));
    }).catch((e) => console.error(e));
  }

  public updateSenha(usuario: Usuario) {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = 'UPDATE usuario SET senha=? WHERE id = ?';
      let data = [
        usuario.senha,
        usuario.id
      ];
      return db.executeSql(sql, data).catch((e) => console.log(JSON.stringify(e)));
    }).catch((e) => console.log(JSON.stringify(e)));
  }

  public remove(id: number) {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = 'DELETE FROM usuario WHERE id = ?';
      let data = [id];
      return db.executeSql(sql, data).catch((e) => console.error(e));
    }).catch((e) => console.error(e));
  }

  public get(id: number) {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = 'SELECT * FROM usuario WHERE id = ?';
      let data = [id];

      return db.executeSql(sql, data).then((data: any) => {
        if (data.rows.length > 0) {
          let item = data.rows.item(0);
          let usuario = new Usuario();
          usuario.id = item.id;
          usuario.nome = item.nome;
          usuario.senha = item.senha;
          usuario.ativo = item.ativo;
          return usuario;
        }
        return null;
      }).catch((e) => console.error(e));
    }).catch((e) => console.error(e));
  }

  public getAll(ativo: boolean, name: string = null) {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = 'SELECT * FROM usuario WHERE 1 = 1 ';
      var data: any[] = [];

      // filtrando pelo nome
      if (name) {
        sql += ' AND nome LIKE ?';
        data.push('%' + name + '%');
      }
      if (ativo) {
        sql += ' AND ativo = ? ';
        data.push(1);
      }
      sql += ' ORDER BY nome ';

      return db.executeSql(sql, data).then((data: any) => {
        if (data.rows.length > 0) {
          let usuarios: any[] = [];
          for (var i = 0; i < data.rows.length; i++) {
            var usuario = data.rows.item(i);
            usuarios.push(usuario);
          }
          return usuarios;
        } else {
          return [];
        }
      }).catch((e) => console.log(JSON.stringify(e)));
    }).catch((e) => console.log(JSON.stringify(e)));
  }
}

export class Usuario {
  id: number;
  nome: string;
  senha: string;
  ativo: boolean;
}
