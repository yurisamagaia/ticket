import { Component } from '@angular/core';
import { NavController, ModalController, ActionSheetController } from 'ionic-angular';
import { ConfiguracaoProvider, Configuracao } from '../../providers/configuracao/configuracao';
import { PedidoPage } from '../../pages/pedido/pedido';
import { EstornarPage } from '../../pages/estornar/estornar';
import { BluetoothPage } from '../../pages/bluetooth/bluetooth';

import { PedidoProvider } from '../../providers/pedido/pedido';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  model: Configuracao;

  constructor(
    public navCtrl: NavController,
    private configuracaoProvider: ConfiguracaoProvider,
    public modalCtrl: ModalController,
    private pedidoProvider: PedidoProvider,
    public actionSheetCtrl: ActionSheetController
  ) {
    this.config();
    this.buscaTeste();
  }

  buscaTeste() {
    this.pedidoProvider.getPedido().then((result: any[]) => {
      console.log(JSON.stringify(result));
    });
    this.pedidoProvider.getItens().then((result: any[]) => {
      console.log(JSON.stringify(result));
    });
  }

  config() {
    this.model = new Configuracao();
    this.configuracaoProvider.get().then((result: any) => {
      this.model = result;
      console.log(JSON.stringify(result))
    });
  }

  pedido(tipo: String) {
    this.navCtrl.push(PedidoPage, { tipo: tipo });
  }

  bluetooth() {
    let profileModal = this.modalCtrl.create(BluetoothPage);
    profileModal.present();
  }

  estornar() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Estornar',
      buttons: [
        {
          text: 'Venda',
          handler: () => {
            this.navCtrl.push(EstornarPage, { tipo: 'produto' });
          }
        },{
          text: 'Estacionamento',
          handler: () => {
            this.navCtrl.push(EstornarPage, { tipo: 'transporte' });
          }
        },{
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
}
