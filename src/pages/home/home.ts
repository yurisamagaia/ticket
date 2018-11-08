import { Component } from '@angular/core';
import { NavController, ModalController, ActionSheetController } from 'ionic-angular';
import { ConfiguracaoProvider, Configuracao } from '../../providers/configuracao/configuracao';
import { PedidoPage } from '../../pages/pedido/pedido';
import { EstornarPage } from '../../pages/estornar/estornar';
import { BluetoothPage } from '../../pages/bluetooth/bluetooth';

import { PedidoProvider } from '../../providers/pedido/pedido';
import { EstornarProvider } from '../../providers/estornar/estornar';

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
    private estornarProvider: EstornarProvider,
    public actionSheetCtrl: ActionSheetController
  ) {
    this.config();
    this.buscaTeste();
    this.estorn();
  }

  estorn() {
    this.estornarProvider.getAll().then((result: any[]) => {
      console.log(JSON.stringify(result));
    })
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
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Estornar'
    });
    if(this.model.venda === 1) {
      actionSheet.addButton({
        text: 'Venda',
        handler: () => {
          this.navCtrl.push(EstornarPage, { tipo: 'produto' });
        }
      });
    }
    if(this.model.estacionamento === 1) {
      actionSheet.addButton({
        text: 'Estacionamento',
        handler: () => {
          this.navCtrl.push(EstornarPage, { tipo: 'transporte' });
        }
      });
    }
    actionSheet.addButton({text: 'Cancel', 'role': 'cancel' });
    actionSheet.present();
  }
}
