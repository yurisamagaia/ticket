import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../database/database';

@Injectable()
export class ConfiguracaoProvider {

  constructor(private dbProvider: DatabaseProvider) { }

  public update(configuracao: Configuracao) {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = 'UPDATE configuracao SET evento=?, impressao_ticket=?, segunda_via=?, placa=?, observacoes=?, operador=?, venda=?, estoque=?, estacionamento=?, dinheiro=?, cartao=? WHERE id = ?';
      let data = [
        configuracao.evento,
        configuracao.impressao_ticket ? 1 : 0,
        configuracao.segunda_via ? 1 : 0,
        configuracao.placa ? 1 : 0,
        configuracao.observacoes,
        configuracao.operador,
        configuracao.venda ? 1 : 0,
        configuracao.estoque ? 1 : 0,
        configuracao.estacionamento ? 1 : 0,
        configuracao.dinheiro ? 1 : 0,
        configuracao.cartao ? 1 : 0,
        configuracao.id
      ];
      return db.executeSql(sql, data).catch((e) => console.log(JSON.stringify(e)));
    }).catch((e) => console.log(JSON.stringify(e)));
  }

  public updateSenha(configuracao: Configuracao) {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = 'UPDATE configuracao SET senha_adm=? WHERE id = ?';
      let data = [
        configuracao.senha_adm,
        configuracao.id
      ];
      return db.executeSql(sql, data).catch((e) => console.log(JSON.stringify(e)));
    }).catch((e) => console.log(JSON.stringify(e)));
  }

  public updateTroco_(configuracao: Configuracao) {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = 'UPDATE configuracao SET troco = ? WHERE id = ?';
      let data = [
        configuracao.troco,
        configuracao.id
      ];
      return db.executeSql(sql, data).catch((e) => console.log(JSON.stringify(e)));
    }).catch((e) => console.log(JSON.stringify(e)));
  }

  public getTroco() {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = 'SELECT troco FROM configuracao';

      return db.executeSql(sql, null).then((data: any) => {
        if (data.rows.length > 0) {
          let item = data.rows.item(0);
          return item;
        }
        return null;
      }).catch((e) => console.error(e));
    }).catch((e) => console.error(e));
  }

  public updateTroco(valor_troco: number, id) {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = 'UPDATE configuracao SET troco=? WHERE id = ?';
      let data = [
        valor_troco,
        id
      ];
      return db.executeSql(sql, data).catch((e) => console.log(JSON.stringify(e)));
    }).catch((e) => console.log(JSON.stringify(e)));
  }

  public updateSangria(valor_sangria: number, id) {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = 'UPDATE configuracao SET sangria=? WHERE id = ?';
      let data = [
        valor_sangria,
        id
      ];
      return db.executeSql(sql, data).catch((e) => console.log(JSON.stringify(e)));
    }).catch((e) => console.log(JSON.stringify(e)));
  }

  public getSangria() {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = 'SELECT sangria FROM configuracao';

      return db.executeSql(sql, null).then((data: any) => {
        if (data.rows.length > 0) {
          let item = data.rows.item(0);
          return item;
        }
        return null;
      }).catch((e) => console.error(e));
    }).catch((e) => console.error(e));
  }

  public get() {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = 'SELECT * FROM configuracao';
      return db.executeSql(sql, null).then((data: any) => {
        if (data.rows.length > 0) {
          let item = data.rows.item(0);
          let configuracao = new Configuracao();
          configuracao.id = item.id;
          configuracao.evento = item.evento;
          configuracao.impressao_ticket = item.impressao_ticket;
          configuracao.segunda_via = item.segunda_via;
          configuracao.placa = item.placa;
          configuracao.observacoes = item.observacoes;
          configuracao.operador = item.operador;
          configuracao.venda = item.venda;
          configuracao.estoque = item.estoque;
          configuracao.estacionamento = item.estacionamento;
          configuracao.dinheiro = item.dinheiro;
          configuracao.cartao = item.cartao;
          configuracao.sangria = item.sangria;
          configuracao.troco = item.troco;
          return configuracao;
        }
        return null;
      }).catch((e) => console.error(JSON.stringify(e)));
    }).catch((e) => console.error(JSON.stringify(e)));
  }

  public getSenha() {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = 'SELECT senha_adm, senha_root FROM configuracao';
      return db.executeSql(sql, null).then((data: any) => {
        if (data.rows.length > 0) {
          let item = data.rows.item(0);
          let configuracao = new Configuracao();
          configuracao.senha_adm = item.senha_adm;
          configuracao.senha_root = item.senha_root;
          return configuracao;
        }
        return null;
      }).catch((e) => console.error(JSON.stringify(e)));
    }).catch((e) => console.error(JSON.stringify(e)));
  }
}

export class Configuracao {
  id: number;
  evento: string;
  impressao_ticket: number;
  segunda_via: number;
  placa: number;
  observacoes: string;
  operador: string;
  venda: number;
  estoque: number;
  estacionamento: number;
  dinheiro: number;
  cartao: number;
  senha_adm: number;
  senha_root: number;
  sangria: number;
  troco: number;
}
