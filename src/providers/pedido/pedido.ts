import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../database/database';
import { DatePipe } from '@angular/common';

import { ProdutoProvider } from '../produto/produto';

@Injectable()
export class PedidoProvider {

  constructor(private dbProvider: DatabaseProvider, private datepipe: DatePipe, private produtoProvider: ProdutoProvider) { }

  public insertPedido(total, forma_pagamento) {
    (forma_pagamento === 'dinheiro' ? forma_pagamento = 'dinheiro' : forma_pagamento = 'cartao');
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = 'INSERT INTO pedido (data, forma_pagamento, total) VALUES (?, ?, ?)';
      let now = this.datepipe.transform(new Date(), "dd/MM/yyyy HH:mm:ss");
      let data = [now, forma_pagamento, total];
      return db.executeSql(sql, data).catch((e) => console.error(JSON.stringify(e)));
    }).catch((e) => console.error(e));
  }

  public insertPedidoItem(item, id_pedido) {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      item.forEach(value => {
        if(value.quantidade > 0) {
          this.produtoProvider.get(value.id).then((result: any) => {
            if(result.ilimitado === 0) {
              result.estoque -= value.quantidade;
              this.produtoProvider.update(result);
            }
            let sql = 'INSERT INTO pedido_item (id_pedido, id_produto, nome, quantidade, valor) VALUES (?, ?, ?, ?, ?)';
            let data = [id_pedido, value.id, value.nome, value.quantidade, value.valor];
            return db.executeSql(sql, data).catch((e) => console.error(JSON.stringify(e)));
          });
        }
      });
    }).catch((e) => console.error(JSON.stringify(e)));
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

  public getItens() {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = "SELECT * FROM pedido_item  ";

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

  public getAbertura() {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = 'SELECT * FROM pedido ORDER BY data ASC';

      return db.executeSql(sql, null).then((data: any) => {
        if (data.rows.length > 0) {
          let item = data.rows.item(0);
          let pedido = new Pedido();
          pedido.data = item.data;
          return pedido;
        }
        return null;
      }).catch((e) => console.error(e));
    }).catch((e) => console.error(e));
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
  nome: String;
  quantidade: number;
  valor: number;
}
