import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { ConfiguracaoProvider, Configuracao } from '../../providers/configuracao/configuracao';
import { PedidoPage } from '../../pages/pedido/pedido';
import { BluetoothPage } from '../../pages/bluetooth/bluetooth';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  model: Configuracao;

  constructor(public navCtrl: NavController, private configuracaoProvider: ConfiguracaoProvider, public modalCtrl: ModalController) {
    //this.config();
  }

  config() {
    this.model = new Configuracao();
    this.configuracaoProvider.get().then((result: any) => {
      this.model = result;
    });
  }

  pedido(tipo: String) {
    this.navCtrl.push(PedidoPage, { tipo: tipo });
  }

  bluetooth() {
    let profileModal = this.modalCtrl.create(BluetoothPage);
    profileModal.present();
  }
}
