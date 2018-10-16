import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../database/database';

@Injectable()
export class ProdutoProvider {

  constructor(private dbProvider: DatabaseProvider) { }

  public insert(produto: Produto) {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = 'INSERT INTO produto (nome, tipo, valor, quantidade, ilimitado, ativo) VALUES (?, ?, ?, ?, ?, ?)';
      let data = [produto.nome, produto.tipo, produto.valor, produto.quantidade, produto.ilimitado ? 1 : 0, produto.ativo ? 1 : 0];
      return db.executeSql(sql, data).catch((e) => console.error(e));
    }).catch((e) => console.error(e));
  }

  public update(produto: Produto) {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = 'UPDATE produto SET nome = ?, tipo = ?, valor = ?, quantidade = ?, ilimitado = ?, ativo = ? where id = ?';
      let data = [produto.nome, produto.tipo, produto.valor, produto.quantidade, produto.ilimitado ? 1 : 0, produto.ativo ? 1 : 0, produto.id];
      return db.executeSql(sql, data).catch((e) => console.error(e));
    }).catch((e) => console.error(e));
  }

  public remove(id: number) {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = 'DELETE FROM produto WHERE id = ?';
      let data = [id];
      return db.executeSql(sql, data).catch((e) => console.error(e));
    }).catch((e) => console.error(e));
  }

  public get(id: number) {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = 'SELECT * FROM produto WHERE id = ?';
      let data = [id];

      return db.executeSql(sql, data).then((data: any) => {
        if (data.rows.length > 0) {
          let item = data.rows.item(0);
          let produto = new Produto();
          produto.id = item.id;
          produto.nome = item.nome;
          produto.tipo = item.tipo;
          produto.valor = item.valor;
          produto.quantidade = item.quantidade;
          produto.ilimitado = item.ilimitado;
          produto.ativo = item.ativo;
          return produto;
        }
        return null;
      }).catch((e) => console.error(e));
    }).catch((e) => console.error(e));
  }

  public getAll(ativo: boolean, name: string = null) {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = 'SELECT * FROM produto ';
      //var data: any[] = [ativo ? 1 : 0];
      var data: any[] = [];

      // filtrando pelo nome
      if (name) {
        sql += ' WHERE nome LIKE ?';
        data.push('%' + name + '%');
      }
      sql += ' ORDER BY nome';

      return db.executeSql(sql, data).then((data: any) => {
        if (data.rows.length > 0) {
          let produtos: any[] = [];
          for (var i = 0; i < data.rows.length; i++) {
            var produto = data.rows.item(i);
            produtos.push(produto);
          }
          return produtos;
        } else {
          return [];
        }
      }).catch((e) => console.log(JSON.stringify(e)));
    }).catch((e) => console.log(JSON.stringify(e)));
  }

  public getLista() {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = 'SELECT * FROM produto WHERE ativo = 1 ORDER BY nome';

      return db.executeSql(sql, null).then((data: any) => {
        if (data.rows.length > 0) {
          let produtos: any[] = [];
          for (var i = 0; i < data.rows.length; i++) {
            var produto = data.rows.item(i);
            produtos.push(produto);
          }
          return produtos;
        } else {
          return [];
        }
      }).catch((e) => console.log(JSON.stringify(e)));
    }).catch((e) => console.log(JSON.stringify(e)));
  }
}

export class Produto {
  id: number;
  nome: string;
  tipo: string = 'produto';
  valor: number;
  quantidade: number;
  ilimitado: boolean;
  ativo: boolean;
}
