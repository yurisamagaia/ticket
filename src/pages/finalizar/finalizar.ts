import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ToastController, ModalController } from 'ionic-angular';
import { DatePipe } from '@angular/common';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { HomePage } from '../../pages/home/home';
import { BluetoothPage } from '../../pages/bluetooth/bluetooth';
import { PedidoProvider } from '../../providers/pedido/pedido';
import { ConfiguracaoProvider, Configuracao } from '../../providers/configuracao/configuracao';
import { EstornarProvider } from '../../providers/estornar/estornar';
import { ImprimirProvider } from '../../providers/imprimir/imprimir';
import { commands } from '../../providers/command/command';

@IonicPage()
@Component({
  selector: 'page-finalizar',
  templateUrl: 'finalizar.html',
})
export class FinalizarPage {

  configuracao: Configuracao;
  produtos: any = [];
  formaPagamento: String;
  valorPago: any;
  total: any;
  troco: number = 0;
  tipo: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private configuracaoProvider: ConfiguracaoProvider,
    public alertCtrl: AlertController,
    private toast: ToastController,
    private pedidoProvider: PedidoProvider,
    private bluetoothSerial: BluetoothSerial,
    public modalCtrl: ModalController,
    private datepipe: DatePipe,
    private estornarProvider: EstornarProvider,
    private imprimirProvider: ImprimirProvider
  ) {
    this.produtos = navParams.get('itens');
    this.total = navParams.get('total');
    this.tipo = navParams.get('tipo');
    this.config();
  }

  estornar() {
    this.estornarProvider.estornar(this.produtos).then(data => {
      this.toast.create({ message: 'Pedido estornado com sucesso', duration: 4000, position: 'bottom' }).present();
      this.viewCtrl.dismiss('finalizar');
    }).catch(() => {
      this.toast.create({ message: 'Erro ao salvar estorno', duration: 3000, position: 'top' }).present();
    });
  }

  imprimir() {
    this.bluetoothSerial.isConnected().then((s) => {
      this.print();
    }, () => {
      let alert = this.alertCtrl.create({
        title: 'Impressora desconectada',
        message: 'Conecte uma impressora para continuar',
        buttons:
        [{
          text: 'Cancelar',
          role: 'cancel'
        },{
          text: 'Conectar Impressora',
          handler: () => {
            this.conectarImpressora();
          }
        }]
      });
      alert.present();
    })
  }

  conectarImpressora() {
    let profileModal = this.modalCtrl.create(BluetoothPage);
    profileModal.present();
  }

  private salvarItem(id_pedido) {
    return this.pedidoProvider.insertPedidoItem(this.produtos, id_pedido);
  }

  private salvarPedido() {
    return this.pedidoProvider.insertPedido(this.total, this.formaPagamento);
  }

  private salvarTroco() {
    this.configuracao.troco += this.troco;
    return this.configuracaoProvider.updateTroco(this.configuracao);
  }

  config() {
    this.configuracao = new Configuracao();
    this.configuracaoProvider.get().then((result: any) => {
      this.configuracao = result;
      if(result.dinheiro) {
        this.formaPagamento = 'dinheiro';
      }else if(result.cartao) {
        this.formaPagamento = 'cartão';
      }
    });
  }

  calculaTroco() {
    if(parseFloat(this.valorPago) >= this.total) {
      this.troco = parseFloat(this.valorPago) - this.total;
    }else{
      this.troco = 0;
    }
  }

  alteraFormaPagamento() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Forma de pagamento');
    if(this.configuracao.dinheiro === 1 && this.formaPagamento === 'dinheiro') {
      alert.addInput({
        type: 'radio',
        label: 'Dinheiro',
        value: 'dinheiro',
        checked: true
      });
    }else if(this.configuracao.dinheiro === 1) {
      alert.addInput({
        type: 'radio',
        label: 'Dinheiro',
        value: 'dinheiro'
      });
    }
    if(this.configuracao.cartao === 1 && this.formaPagamento === 'cartão') {
      alert.addInput({
        type: 'radio',
        label: 'Cartão',
        value: 'cartão',
        checked: true
      });
    }else if(this.configuracao.cartao === 1) {
      alert.addInput({
        type: 'radio',
        label: 'Cartão',
        value: 'cartão'
      });
    }
    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        this.formaPagamento = data;
      }
    });
    alert.present();
  }

  formaPagamentoEstorno(pagamento) {
    this.formaPagamento = pagamento;
  }

  print() {

    let receipt = '';
    let dataNow = 'Data:'+this.datepipe.transform(new Date(), "dd/MM/yyyy");
    let horaNow = 'Hora:'+this.datepipe.transform(new Date(), "HH:mm:ss");

    this.produtos.forEach(value => {

      if(value.tipo === 'transporte') {

        let segunda_via = 1;

        if(this.configuracao.segunda_via === 1) {
          segunda_via = 2;
        }

        for(let i = 0; i < segunda_via; i++) {
          receipt += commands.HARDWARE.HW_INIT;
          receipt += commands.TEXT_FORMAT.TXT_2HEIGHT;
          receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
          receipt += this.configuracao.evento;
          receipt += commands.EOL;
          receipt += commands.TEXT_FORMAT.TXT_NORMAL;
          receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
          receipt += "Comprovante de estacionamento";
          receipt += commands.EOL;
          receipt += commands.EOL;
          receipt += commands.TEXT_FORMAT.TXT_4SQUARE;
          receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
          receipt += value.nome.toUpperCase();
          if(value.modelo) {
            receipt += commands.EOL;
            receipt += commands.TEXT_FORMAT.TXT_2HEIGHT;
            receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
            receipt += value.modelo;
          }
          if(value.placa) {
            receipt += commands.EOL;
            receipt += commands.TEXT_FORMAT.TXT_4SQUARE;
            receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
            receipt += value.placa;
          }
          if(this.configuracao.totais === 1){
            receipt += commands.EOL;
            receipt += commands.TEXT_FORMAT.TXT_2HEIGHT;
            receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
            receipt += "Valor: R$ "+(parseFloat(value.valor)).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
          }
          receipt += commands.EOL;
          receipt += commands.TEXT_FORMAT.TXT_NORMAL;
          receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
          receipt += "ENTRADA";
          receipt += commands.EOL;
          receipt += commands.TEXT_FORMAT.TXT_NORMAL;
          receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
          receipt += commands.LINE_SPACING.LS_DEFAULT;
          receipt += dataNow+' '+horaNow;
          if(this.configuracao.observacoes) {
            receipt += commands.EOL;
            receipt += commands.TEXT_FORMAT.TXT_NORMAL;
            receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
            receipt += commands.TEXT_FORMAT.TXT_UNDERL_ON;
            receipt += "IMPORTANTE";
            receipt += commands.EOL;
            receipt += commands.TEXT_FORMAT.TXT_NORMAL;
            receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
            receipt += commands.TEXT_FORMAT.TXT_UNDERL_ON;
            receipt += this.configuracao.observacoes;
          }
          if(this.configuracao.operador) {
            receipt += commands.EOL;
            receipt += commands.TEXT_FORMAT.TXT_NORMAL;
            receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
            receipt += "Operador(a): "+this.configuracao.operador;
          }
          receipt += commands.EOL;
          receipt += commands.EOL;
          receipt += commands.HORIZONTAL_LINE.HR4_58MM;
          receipt += commands.EOL;
          receipt += commands.EOL;
        }

      } else if(value.tipo === 'produto') {

        if(this.configuracao.impressao_ticket === 1) {
          let textQtd = '';
          if(value.quantidade > 1) {
            textQtd = '(s)';
          }
          receipt += commands.HARDWARE.HW_INIT;
          receipt += commands.TEXT_FORMAT.TXT_2HEIGHT;
          receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
          receipt += this.configuracao.evento;
          receipt += commands.EOL;
          receipt += commands.EOL;
          receipt += commands.TEXT_FORMAT.TXT_NORMAL;
          receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
          receipt += "Vale";
          receipt += commands.EOL;
          receipt += commands.TEXT_FORMAT.TXT_4SQUARE;
          receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
          receipt += value.quantidade+' '+value.nome+textQtd;
          if(this.configuracao.totais === 1){
            receipt += commands.EOL;
            receipt += commands.EOL;
            receipt += commands.TEXT_FORMAT.TXT_NORMAL;
            receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
            receipt += "Valor: R$ "+(parseFloat(value.valor)).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
          }
          receipt += commands.EOL;
          receipt += commands.TEXT_FORMAT.TXT_NORMAL;
          receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
          receipt += commands.DC4;
          receipt += dataNow+' '+horaNow;
          if(this.configuracao.operador) {
            receipt += commands.EOL;
            receipt += commands.TEXT_FORMAT.TXT_NORMAL;
            receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
            receipt += "Operador(a): "+this.configuracao.operador;
          }
          receipt += commands.EOL;
          receipt += commands.EOL;
          receipt += commands.HORIZONTAL_LINE.HR4_58MM;
          receipt += commands.EOL;
          receipt += commands.EOL;

        }else{

          for(let i = 0; i < value.quantidade; i++) {
            receipt += commands.HARDWARE.HW_INIT;
            receipt += commands.TEXT_FORMAT.TXT_2HEIGHT;
            receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
            receipt += this.configuracao.evento;
            receipt += commands.EOL;
            receipt += commands.EOL;
            receipt += commands.TEXT_FORMAT.TXT_NORMAL;
            receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
            receipt += "Vale um(a)";
            receipt += commands.EOL;
            receipt += commands.TEXT_FORMAT.TXT_4SQUARE;
            receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
            receipt += value.nome;
            if(this.configuracao.totais === 1){
              receipt += commands.EOL;
              receipt += commands.EOL;
              receipt += commands.TEXT_FORMAT.TXT_NORMAL;
              receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
              receipt += "Valor: R$ "+(parseFloat(value.valor)).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
            }
            receipt += commands.EOL;
            receipt += commands.TEXT_FORMAT.TXT_NORMAL;
            receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
            receipt += commands.DC4;
            receipt += dataNow+' '+horaNow;
            if(this.configuracao.operador) {
              receipt += commands.EOL;
              receipt += commands.TEXT_FORMAT.TXT_NORMAL;
              receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
              receipt += "Operador(a): "+this.configuracao.operador;
            }
            receipt += commands.EOL;
            receipt += commands.EOL;
            receipt += commands.HORIZONTAL_LINE.HR4_58MM;
            receipt += commands.EOL;
            receipt += commands.EOL;
          }
        }
      }
    });

    if(this.configuracao.totais === 1){
      receipt += commands.TEXT_FORMAT.TXT_NORMAL;
      receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
      receipt += 'Forma de Pagamento: '+this.formaPagamento.toUpperCase();
      receipt += commands.EOL;
      receipt += commands.TEXT_FORMAT.TXT_2HEIGHT;
      receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
      receipt += 'Valor Total da Compra';
      receipt += commands.EOL;
      receipt += commands.TEXT_FORMAT.TXT_2HEIGHT;
      receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
      receipt += "R$ "+(parseFloat(this.total)).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
      receipt += commands.EOL;
      receipt += commands.EOL;
      receipt += commands.EOL;
    }

    receipt = this.noSpecialChars(receipt);

    this.salvarTroco().then(() => {
      this.salvarPedido().then(data => {
        this.salvarItem(data.insertId).then(() => {
          this.bluetoothSerial.write(receipt).then(() => {
            this.toast.create({ message: 'Pedido realizado com sucesso, aguarde a impressão do ticket', duration: 4000, position: 'bottom' }).present();
            this.viewCtrl.dismiss('finalizar');
          }, (error) => {
            let alert = this.alertCtrl.create({
              title: 'Erro',
              message: error,
              buttons: [{ text: 'Concluir' }]
            });
            alert.present();
          });
        }).catch(() => {
          this.toast.create({ message: 'Erro ao salvar item', duration: 3000, position: 'top' }).present();
        });
      }).catch(() => {
        this.toast.create({ message: 'Erro ao salvar pedido', duration: 3000, position: 'top' }).present();
      });
    }).catch(() => {
      this.toast.create({ message: 'Erro ao salvar troco', duration: 3000, position: 'top' }).present();
    });
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  noSpecialChars(string) {
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
