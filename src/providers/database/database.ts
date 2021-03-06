import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class DatabaseProvider {

  constructor(private sqlite: SQLite) { }

  /**
   * Cria um banco caso não exista ou pega um banco existente com o nome no parametro
   */
  public getDB() {
    return this.sqlite.create({
      name: 'ticket.db',
      location: 'default'
    });
  }

  /**
   * Cria a estrutura inicial do banco de dados
   */
  public createDatabase() {
    return this.getDB().then((db: SQLiteObject) => {
      this.createTables(db);
      this.insertDefaultItems(db);
    }).catch(e => console.log(JSON.stringify(e)));
  }

  public clearDatabase() {
    return this.getDB().then((db: SQLiteObject) => {
      this.clearTables(db);
      return true;
    }).catch(e => {
      console.log(JSON.stringify(e));
      return false;
    });
  }

  /**
   * Criando as tabelas no banco de dados
   * @param db
   */
  private createTables(db: SQLiteObject) {
    db.sqlBatch([
      //['DROP TABLE configuracao'],
      ['CREATE TABLE IF NOT EXISTS pedido (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, data DATE, forma_pagamento TEXT, total REAL)'],
      ['CREATE TABLE IF NOT EXISTS pedido_item (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, id_pedido integer, id_produto integer, nome TEXT, quantidade integer, valor REAL, FOREIGN KEY(id_produto) REFERENCES produto(id), FOREIGN KEY(id_pedido) REFERENCES pedido(id))'],
      ['CREATE TABLE IF NOT EXISTS estornar (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, id_produto integer, nome TEXT, quantidade integer, valor REAL, FOREIGN KEY(id_produto) REFERENCES produto(id))'],

      ['CREATE TABLE IF NOT EXISTS produto (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, nome TEXT, tipo TEXT, valor REAL, estoque integer, ilimitado integer, ordem integer, ativo integer)'],
      //['CREATE TABLE IF NOT EXISTS usuario (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, nome TEXT, senha TEXT, ativo integer)'],
      ['CREATE TABLE IF NOT EXISTS configuracao (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, evento TEXT, impressao_ticket integer, segunda_via integer, placa integer, observacoes TEXT, operador TEXT, venda integer, estoque integer, estacionamento integer, dinheiro integer, cartao integer, sangria REAL, troco REAL, senha_adm integer, senha_root integer)']
    ]).then(() => console.log('Tabelas criadas')).catch(e => console.error('Erro ao criar as tabelas', console.log(JSON.stringify(e))));
  }

  /**
   * Incluindo os dados padrões
   * @param db
   */
  private insertDefaultItems(db: SQLiteObject) {
    db.executeSql('SELECT COUNT(id) as qtd FROM configuracao', <any>{}).then((data: any) => {
      if (data.rows.item(0).qtd === 0) {
        db.sqlBatch([
          ['INSERT INTO configuracao (evento, impressao_ticket, segunda_via, placa, observacoes, operador, venda, estoque, estacionamento, dinheiro, cartao, sangria, troco, senha_adm, senha_root) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', ['', 0, 0, 0, '', '', 0, 0, 0, 1, 0, 0, 0, 123456, 2167]]
        ]).then(() => console.log('Dados padrões incluídos')).catch(e => console.error('Erro ao incluir dados padrões', e));
      }
    }).catch(e => console.error('Erro ao consultar a qtd de categorias', e));
  }

  private clearTables(db: SQLiteObject) {
    db.sqlBatch([
      ['DELETE FROM pedido'],
      ['DELETE FROM pedido_item'],
      ['DELETE FROM estornar'],
      ['UPDATE configuracao SET sangria = 0, troco = 0']
    ]).then(() => console.log('Tabelas criadas')).catch(e => console.error('Erro ao criar as tabelas', console.log(JSON.stringify(e))));
  }
}
