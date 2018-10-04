import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../database/database';

@Injectable()
export class TransporteProvider {

  constructor(private dbProvider: DatabaseProvider) { }

  public insert(transporte: Transporte) {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = 'INSERT INTO transporte (nome, valor, ativo) VALUES (?, ?, ?)';
      let data = [transporte.nome, transporte.valor, transporte.ativo ? 1 : 0];
      return db.executeSql(sql, data).catch((e) => console.error(JSON.stringify(e)));
    }).catch((e) => console.error(JSON.stringify(e)));
  }

  public update(transporte: Transporte) {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = 'UPDATE transporte SET nome = ?, valor = ?, ativo = ? where id = ?';
      let data = [transporte.nome, transporte.valor, transporte.ativo ? 1 : 0, transporte.id];
      return db.executeSql(sql, data).catch((e) => console.error(JSON.stringify(e)));
    }).catch((e) => console.error(JSON.stringify(e)));
  }

  public remove(id: number) {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = 'DELETE FROM transporte WHERE id = ?';
      let data = [id];
      return db.executeSql(sql, data).catch((e) => console.error(JSON.stringify(e)));
    }).catch((e) => console.error(JSON.stringify(e)));
  }

  public get(id: number) {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = 'SELECT * FROM transporte WHERE id = ?';
      let data = [id];

      return db.executeSql(sql, data).then((data: any) => {
        if (data.rows.length > 0) {
          let item = data.rows.item(0);
          let transporte = new Transporte();
          transporte.id = item.id;
          transporte.nome = item.nome;
          transporte.valor = item.valor;
          transporte.ativo = item.ativo;
          return transporte;
        }
        return null;
      }).catch((e) => console.error(JSON.stringify(e)));
    }).catch((e) => console.error(JSON.stringify(e)));
  }

  public getAll(ativo: boolean, name: string = null) {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = 'SELECT * FROM transporte ';
      var data: any[] = [];

      // filtrando pelo nome
      if (name) {
        sql += ' WHERE nome LIKE ?';
        data.push('%' + name + '%');
      }
      sql += ' ORDER BY nome';
      return db.executeSql(sql, data).then((data: any) => {
        if (data.rows.length > 0) {
          let transportes: any[] = [];
          for (var i = 0; i < data.rows.length; i++) {
            var transporte = data.rows.item(i);
            transportes.push(transporte);
          }
          return transportes;
        } else {
          return [];
        }
      }).catch((e) => console.error(JSON.stringify(e)));
    }).catch((e) => console.error(JSON.stringify(e)));
  }
}

export class Transporte {
  id: number;
  nome: string;
  valor: number;
  ativo: boolean;
}
