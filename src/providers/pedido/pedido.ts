import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../database/database';
import { DatePipe } from '@angular/common';

@Injectable()
export class PedidoProvider {

  constructor(private dbProvider: DatabaseProvider, private datepipe: DatePipe) { }

  public insertPedido(total) {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = 'INSERT INTO pedido (data, total) VALUES (?, ?)';
      let now = this.datepipe.transform(new Date(), "dd/MM/yyyy");
      let data = [now, total];
      return db.executeSql(sql, data).catch((e) => console.error(JSON.stringify(e)));
    }).catch((e) => console.error(e));
  }

  public insertPedidoItem(item) {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = 'INSERT INTO pedido_item (id_pedido, id_produto, quantidade, valor) VALUES (?, ?, ?, ?)';
      let data = [item.id_produto, item.id_pedido, item.quantidade, item.valor];
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

  public getPedido() {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = "SELECT * FROM pedido";

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

export class Pedido {
  id: number;
  data: Date;
  total: number = 0;
}

export class Item {
  id: number;
  id_pedido: number;
  id_produto: number;
  quantidade: number;
  valor: number;
}
