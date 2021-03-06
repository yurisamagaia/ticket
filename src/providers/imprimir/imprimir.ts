import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { EstornarProvider } from '../../providers/estornar/estornar';
import { commands } from '../../providers/command/command';

@Injectable()
export class ImprimirProvider {

  constructor(
    private datepipe: DatePipe,
    private estornarProvider: EstornarProvider
  ) { }

  public relatorio(relatorio, configuracao, total, totalDinheiro, totalCartao, aberturaCaixa = null, tipo) {
    return new Promise(resolve => {

      let receipt = '';
      let dataNow = 'Data:'+this.datepipe.transform(new Date(), "dd/MM/yyyy");
      let horaNow = 'Hora:'+this.datepipe.transform(new Date(), "HH:mm:ss");

      if(aberturaCaixa) {
        var dataAbertura = aberturaCaixa.data.trim();
        dataAbertura = dataAbertura.split(" ");
        var novaDataAbertura = 'Data:'+dataAbertura[0]+' Hora:'+dataAbertura[1];
      }

      var saldo_total = parseFloat(total)+parseFloat(configuracao.troco);
      saldo_total -= parseFloat(configuracao.sangria);

      this.estornarProvider.getTotal().then(totalEstornado => {

        receipt += commands.HARDWARE.HW_INIT;
        receipt += commands.TEXT_FORMAT.TXT_2HEIGHT;
        receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
        receipt += tipo;
        receipt += commands.EOL;
        if(configuracao.evento) {
          receipt += commands.TEXT_FORMAT.TXT_2HEIGHT;
          receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
          receipt += configuracao.evento;
          receipt += commands.EOL;
          receipt += commands.EOL;
        }
        receipt += commands.TEXT_FORMAT.TXT_2HEIGHT;
        receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
        receipt += 'VENDAS';
        receipt += commands.EOL;
        receipt += commands.EOL;

        relatorio.forEach(value => {
          receipt += commands.TEXT_FORMAT.TXT_NORMAL;
          receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
          receipt += value.nome.toUpperCase();
          receipt += commands.EOL;
          receipt += commands.TEXT_FORMAT.TXT_NORMAL;
          receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
          receipt += 'Quantidade: '+value.total_quantidade;
          receipt += commands.EOL;
          receipt += commands.TEXT_FORMAT.TXT_NORMAL;
          receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
          receipt += 'Subtotal: R$ '+(parseFloat(value.subtotal)).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
          receipt += commands.EOL;
          receipt += commands.EOL;
        });

        receipt += commands.TEXT_FORMAT.TXT_NORMAL;
        receipt += commands.TEXT_FORMAT.TXT_ALIGN_RT;
        receipt += 'VALORES ESTORNADOS: R$ '+(parseFloat(totalEstornado)).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        receipt += commands.EOL;
        receipt += commands.TEXT_FORMAT.TXT_NORMAL;
        receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
        receipt += 'Totais por Forma de Pagamento';
        receipt += commands.EOL;
        receipt += commands.TEXT_FORMAT.TXT_NORMAL;
        receipt += commands.TEXT_FORMAT.TXT_ALIGN_RT;
        receipt += 'Dinheiro: R$ '+(parseFloat(totalDinheiro)).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        receipt += commands.EOL;
        receipt += commands.TEXT_FORMAT.TXT_NORMAL;
        receipt += commands.TEXT_FORMAT.TXT_ALIGN_RT;
        receipt += 'Cartao: R$ '+(parseFloat(totalCartao)).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        receipt += commands.EOL;
        receipt += commands.TEXT_FORMAT.TXT_2HEIGHT;
        receipt += commands.TEXT_FORMAT.TXT_ALIGN_RT;
        receipt += commands.TEXT_FORMAT.TXT_BOLD_ON;
        receipt += 'TOTAL: R$ '+(parseFloat(total)).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        receipt += commands.EOL;
        receipt += commands.EOL;
        receipt += commands.TEXT_FORMAT.TXT_2HEIGHT;
        receipt += commands.TEXT_FORMAT.TXT_ALIGN_RT;
        receipt += commands.TEXT_FORMAT.TXT_BOLD_ON;
        receipt += 'SALDO FINAL';
        receipt += commands.EOL;
        receipt += commands.TEXT_FORMAT.TXT_NORMAL;
        receipt += commands.TEXT_FORMAT.TXT_ALIGN_RT;
        receipt += 'TOTAL (+): R$ '+(parseFloat(total)).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        receipt += commands.EOL;
        receipt += commands.TEXT_FORMAT.TXT_NORMAL;
        receipt += commands.TEXT_FORMAT.TXT_ALIGN_RT;
        receipt += 'TROCO (+): R$ '+(parseFloat(configuracao.troco)).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        receipt += commands.EOL;
        receipt += commands.TEXT_FORMAT.TXT_NORMAL;
        receipt += commands.TEXT_FORMAT.TXT_ALIGN_RT;
        receipt += 'SANGRIA (-): R$ '+(parseFloat(configuracao.sangria)).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        receipt += commands.EOL;
        receipt += commands.TEXT_FORMAT.TXT_2HEIGHT;
        receipt += commands.TEXT_FORMAT.TXT_ALIGN_RT;
        receipt += commands.TEXT_FORMAT.TXT_BOLD_ON;
        receipt += 'SALDO: R$ '+(saldo_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        if(aberturaCaixa) {
          receipt += commands.EOL;
          receipt += commands.EOL;
          receipt += commands.TEXT_FORMAT.TXT_NORMAL;
          receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
          receipt += "Abertura";
          receipt += commands.EOL;
          receipt += novaDataAbertura;
          receipt += commands.EOL;
          receipt += commands.TEXT_FORMAT.TXT_NORMAL;
          receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
          receipt += "Fechamento";
          receipt += commands.EOL;
          receipt += dataNow+' '+horaNow;
        } else {
          receipt += commands.EOL;
          receipt += commands.EOL;
          receipt += commands.TEXT_FORMAT.TXT_NORMAL;
          receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
          receipt += "Impressao";
          receipt += commands.EOL;
          receipt += dataNow+' '+horaNow;
        }
        receipt += commands.EOL;
        receipt += commands.TEXT_FORMAT.TXT_NORMAL;
        receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
        receipt += "Operador(a): "+configuracao.operador;
        receipt += commands.EOL;
        receipt += commands.EOL;
        receipt += commands.EOL;

        receipt = this.noSpecialChars(receipt);

        resolve(receipt)
      })
    });
  }

  public imprimeSangriaTroco(configuracao, tipo, valor) {
    return new Promise(resolve => {

      let receipt = '';
      let dataNow = 'Data:'+this.datepipe.transform(new Date(), "dd/MM/yyyy");
      let horaNow = 'Hora:'+this.datepipe.transform(new Date(), "HH:mm:ss");

      receipt += commands.HARDWARE.HW_INIT;
      if(configuracao.evento) {
        receipt += commands.TEXT_FORMAT.TXT_2HEIGHT;
        receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
        receipt += configuracao.evento;
        receipt += commands.EOL;
        receipt += commands.EOL;
      }
      receipt += commands.TEXT_FORMAT.TXT_4SQUARE;
      receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
      receipt += tipo;
      receipt += commands.EOL;
      receipt += commands.TEXT_FORMAT.TXT_2HEIGHT;
      receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
      receipt += commands.TEXT_FORMAT.TXT_BOLD_ON;
      receipt += 'Valor: R$ '+(parseFloat(valor)).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
      if(tipo === 'Sangria') {
        receipt += commands.EOL;
        receipt += commands.EOL;
        receipt += commands.TEXT_FORMAT.TXT_NORMAL;
        receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
        receipt += 'Ass.: __________________________';
      }
      receipt += commands.EOL;
      receipt += commands.EOL;
      receipt += commands.TEXT_FORMAT.TXT_NORMAL;
      receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
      receipt += dataNow+' '+horaNow;
      receipt += commands.EOL;
      receipt += commands.TEXT_FORMAT.TXT_NORMAL;
      receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
      receipt += "Operador(a): "+configuracao.operador;
      receipt += commands.EOL;
      receipt += commands.EOL;
      receipt += commands.EOL;

      receipt = this.noSpecialChars(receipt);

      resolve(receipt)
    });
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
