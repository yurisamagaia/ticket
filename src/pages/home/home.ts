import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ConfiguracaoProvider, Configuracao } from '../../providers/configuracao/configuracao';
import { PedidoPage } from '../../pages/pedido/pedido';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  model: Configuracao;

  constructor(public navCtrl: NavController, private configuracaoProvider: ConfiguracaoProvider) {
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
}
