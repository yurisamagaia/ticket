import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { ConfiguracaoProvider, Configuracao } from '../../providers/configuracao/configuracao';
import { Veiculo } from '../../providers/modal-placa/modal-placa';

@Component({
  selector: 'page-modal-placa',
  templateUrl: 'modal-placa.html',
})
export class ModalPlacaPage {

  model: Veiculo;
  configuracao: Configuracao;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private configuracaoProvider: ConfiguracaoProvider,
    public viewCtrl: ViewController
  ) {
    this.model = new Veiculo();
    this.configuracao = new Configuracao();
    this.config();
  }

  confirmar() {
    let data = { modelo: this.model.modelo, placa: this.model.placa };
    this.viewCtrl.dismiss(data);
  }

  config() {
    this.configuracaoProvider.get().then((result: any) => {
      this.configuracao = result;
    });
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }
}
