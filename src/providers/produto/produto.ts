import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../database/database';

@Injectable()
export class ProdutoProvider {

  constructor(private dbProvider: DatabaseProvider) { }

  public insert(produto: Produto) {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = 'INSERT INTO produto (nome, tipo, valor, estoque, ilimitado, ordem, ativo) VALUES (?, ?, ?, ?, ?, ?, ?)';
      let data = [this.noSpecialChars(produto.nome.toUpperCase()), produto.tipo, produto.valor, produto.estoque, produto.ilimitado ? 1 : 0, 0, produto.ativo ? 1 : 0];
      return db.executeSql(sql, data).catch((e) => console.error(e));
    }).catch((e) => console.error(e));
  }

  public update(produto: Produto) {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = 'UPDATE produto SET nome = ?, tipo = ?, valor = ?, estoque = ?, ilimitado = ?, ordem = ?, ativo = ? where id = ?';
      let data = [this.noSpecialChars(produto.nome.toUpperCase()), produto.tipo, produto.valor, produto.estoque, produto.ilimitado ? 1 : 0, produto.ordem, produto.ativo ? 1 : 0, produto.id];
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
          produto.estoque = item.estoque;
          produto.ilimitado = item.ilimitado;
          produto.ordem = item.ordem;
          produto.ativo = item.ativo;
          return produto;
        }
        return null;
      }).catch((e) => console.error(e));
    }).catch((e) => console.error(e));
  }

  public getAll(ativo: boolean, name: string = null, tipo: string = null) {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = 'SELECT * FROM produto WHERE 1 = 1 ';
      //var data: any[] = [ativo ? 1 : 0];
      var data: any[] = [];

      // filtrando pelo nome
      if (name) {
        sql += ' AND nome LIKE ?';
        data.push('%' + name + '%');
      }
      if (tipo) {
        sql += ' AND tipo = ? ';
        data.push(tipo);
      }
      if (ativo) {
        sql += ' AND ativo = ? ';
        data.push(1);
      }
      sql += ' ORDER BY nome ASC';

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

  public noSpecialChars(string) {
    var translate = {
        "à": "a",
        "á": "a",
        "â": "a",
        "ã": "a",
        "ä": "a",
        "å": "a",
        "æ": "a",
        "ç": "c",
        "è": "e",
        "é": "e",
        "ê": "e",
        "ë": "e",
        "ì": "i",
        "í": "i",
        "î": "i",
        "ï": "i",
        "ð": "d",
        "ñ": "n",
        "ò": "o",
        "ó": "o",
        "ô": "o",
        "õ": "o",
        "ö": "o",
        "ø": "o",
        "ù": "u",
        "ú": "u",
        "û": "u",
        "ü": "u",
        "ý": "y",
        "þ": "b",
        "ÿ": "y",
        "ŕ": "r",
        "À": "A",
        "Á": "A",
        "Â": "A",
        "Ã": "A",
        "Ä": "A",
        "Å": "A",
        "Æ": "A",
        "Ç": "C",
        "È": "E",
        "É": "E",
        "Ê": "E",
        "Ë": "E",
        "Ì": "I",
        "Í": "I",
        "Î": "I",
        "Ï": "I",
        "Ð": "D",
        "Ñ": "N",
        "Ò": "O",
        "Ó": "O",
        "Ô": "O",
        "Õ": "O",
        "Ö": "O",
        "Ø": "O",
        "Ù": "U",
        "Ú": "U",
        "Û": "U",
        "Ü": "U",
        "Ý": "Y",
        "Þ": "B",
        "Ÿ": "Y",
        "Ŕ": "R"
      },
      translate_re = /[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþßàáâãäåæçèéêëìíîïðñòóôõöøùúûýýþÿŕŕÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÝÝÞŸŔŔ]/gim;
    return (string.replace(translate_re, function (match) {
      return translate[match];
    }));
  }
}

export class Produto {
  id: number;
  nome: string;
  tipo: string = 'produto';
  valor: number;
  estoque: number;
  ilimitado: boolean;
  ordem: number;
  ativo: boolean;
}
