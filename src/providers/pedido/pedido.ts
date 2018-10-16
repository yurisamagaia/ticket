import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../database/database';

@Injectable()
export class PedidoProvider {

  constructor(private dbProvider: DatabaseProvider) { }

  public insertPedido(produto: Produto) {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = 'INSERT INTO pedido (total) VALUES (?)';
      let data = [produto.total];
      return db.executeSql(sql, data).catch((e) => console.error(JSON.stringify(e)));
    }).catch((e) => console.error(e));
  }

  public insertPedidoItem(produto: Produto) {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = 'INSERT INTO pedido_item (id_produto, id_pedido, valor, quantidade) VALUES (?, ?, ?, ?)';
      let data = [produto.id_produto, produto.id_pedido, produto.valor, produto.quantidade];
      return db.executeSql(sql, data).catch((e) => console.error(e));
    }).catch((e) => console.error(e));
  }

  public getAll(tabela: String) {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = "SELECT * FROM produto WHERE tipo = '"+tabela+"' AND ativo = 1 ORDER BY nome";

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
  id_produto: number;
  id_pedido: number;
  quantidade: number;
  valor: number;
  total: number;
}
