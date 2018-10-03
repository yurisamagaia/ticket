import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../database/database';

@Injectable()
export class ConfiguracaoProvider {

  constructor(private dbProvider: DatabaseProvider) { }

  public update(configuracao: Configuracao) {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = 'UPDATE configuracao SET evento=?, impressao_ticket=?, segunda_via=?, placa=?, observacoes=?, operador=?, venda=?, estoque=?, estacionamento=?, totais=?, dinheiro=?, cartao=? WHERER id = ?';
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
        configuracao.totais ? 1 : 0,
        configuracao.dinheiro ? 1 : 0,
        configuracao.cartao ? 1 : 0,
        configuracao.id
      ];
      return db.executeSql(sql, data).catch((e) => console.error(e));
    }).catch((e) => console.error(e));
  }

  public get() {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = 'SELECT * FROM configuracao';

      return db.executeSql(sql).then((data: any) => {
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
          configuracao.totais = item.totais;
          configuracao.dinheiro = item.dinheiro;
          configuracao.cartao = item.cartao;
          return configuracao;
        }
        return null;
      }).catch((e) => console.error(e));
    }).catch((e) => console.error(e));
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
  totais: number;
  dinheiro: number;
  cartao: number;
}
