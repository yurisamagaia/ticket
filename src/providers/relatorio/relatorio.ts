import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../database/database';

@Injectable()
export class RelatorioProvider {

  total_dinheiro: any;
  total_cartao: any;

  constructor(private dbProvider: DatabaseProvider) { }

  public relatorio() {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = 'SELECT *, SUM(quantidade) AS total_quantidade FROM pedido_item GROUP BY id_produto';

      return db.executeSql(sql, null).then((data: any) => {
        if (data.rows.length > 0) {
          let produtos: any[] = [];
          for (var i = 0; i < data.rows.length; i++) {
            data.rows.item(i).subtotal = data.rows.item(i).total_quantidade * data.rows.item(i).valor;
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

  public relatorioTotal() {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = 'SELECT SUM(total) AS total FROM pedido';

      return db.executeSql(sql, null).then((data: any) => {
        let item = data.rows.item(0);
        if(item.total) {
          return item.total;
        } else {
          return 0;
        }
      }).catch((e) => console.error(e));
    }).catch((e) => console.error(e));
  }

  public relatorioTotalDinheiro() {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = "SELECT SUM(total) AS total FROM pedido WHERE forma_pagamento = 'dinheiro'";

      return db.executeSql(sql, null).then((data: any) => {
        let item = data.rows.item(0);
        if(item.total) {
          return item.total;
        } else {
          return 0;
        }
      }).catch((e) => console.log(JSON.stringify(e)));
    }).catch((e) => console.log(JSON.stringify(e)));
  }

  public relatorioTotalCartao() {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = "SELECT SUM(total) AS total FROM pedido WHERE forma_pagamento = 'cartao'";

      return db.executeSql(sql, null).then((data: any) => {
        let item = data.rows.item(0);
        if(item.total) {
          return item.total;
        } else {
          return 0;
        }
      }).catch((e) => console.log(JSON.stringify(e)));
    }).catch((e) => console.log(JSON.stringify(e)));
  }
}
