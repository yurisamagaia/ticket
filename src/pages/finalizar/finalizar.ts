import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { ConfiguracaoProvider, Configuracao } from '../../providers/configuracao/configuracao';

@IonicPage()
@Component({
  selector: 'page-finalizar',
  templateUrl: 'finalizar.html',
})
export class FinalizarPage {

  model: Configuracao;
  itens: any = [];
  formaPagamento: String;
  valorPago: any;
  total: any = 0;
  troco: any = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private configuracaoProvider: ConfiguracaoProvider,
    public alertCtrl: AlertController
  ) {
    this.itens = navParams.get('itens');
    this.total = navParams.get('total');
    console.log(JSON.stringify(this.itens))
    this.config();
  }

  config() {
    this.model = new Configuracao();
    this.configuracaoProvider.get().then((result: any) => {
      this.model = result;
      if(result.dinheiro) {
        this.formaPagamento = 'dinheiro';
      }else if(result.cartao) {
        this.formaPagamento = 'cartão';
      }
    });
  }

  calculaTroco() {
    this.troco = this.valorPago - this.total;
  }

  alteraFormaPagamento() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Forma de pagamento');

    if(this.model.dinheiro === 1 && this.formaPagamento === 'dinheiro') {
      alert.addInput({
        type: 'radio',
        label: 'Dinheiro',
        value: 'dinheiro',
        checked: true
      });
    }else if(this.model.dinheiro === 1) {
      alert.addInput({
        type: 'radio',
        label: 'Dinheiro',
        value: 'dinheiro'
      });
    }

    if(this.model.cartao === 1 && this.formaPagamento === 'cartão') {
      alert.addInput({
        type: 'radio',
        label: 'Cartão',
        value: 'cartão',
        checked: true
      });
    }else if(this.model.cartao === 1) {
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

  closeModal() {
    this.viewCtrl.dismiss();
  }
}
