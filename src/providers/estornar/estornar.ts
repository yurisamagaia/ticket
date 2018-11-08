import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../database/database';
import { ProdutoProvider } from '../produto/produto';


@Injectable()
export class EstornarProvider {

  constructor(private dbProvider: DatabaseProvider, private produtoProvider: ProdutoProvider) { }

  public estornar(item) {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      item.forEach(value => {
        if(value.quantidade > 0) {
          this.produtoProvider.get(value.id).then((result: any) => {
            if(result.ilimitado === 0) {
              result.estoque += value.quantidade;
              this.produtoProvider.update(result);
            }
            let sql = 'INSERT INTO estornar (id_produto, nome, quantidade, valor) VALUES (?, ?, ?, ?)';
            let data = [value.id, value.nome, value.quantidade, value.valor];
            return db.executeSql(sql, data).catch((e) => console.error(JSON.stringify(e)));
          });
        }
      });
    }).catch((e) => console.error(JSON.stringify(e)));
  }

  public getAll() {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = 'SELECT * FROM estornar';

      return db.executeSql(sql, null).then((data: any) => {
        if (data.rows.length > 0) {
          let estornos: any[] = [];
          for (var i = 0; i < data.rows.length; i++) {
            var estorno = data.rows.item(i);
            estornos.push(estorno);
          }
          return estornos;
        } else {
          return [];
        }
      }).catch((e) => console.log(JSON.stringify(e)));
    }).catch((e) => console.log(JSON.stringify(e)));
  }
}
