import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { ConfiguracaoProvider, Configuracao } from '../../providers/configuracao/configuracao';

@IonicPage()
@Component({
  selector: 'page-configuracao',
  templateUrl: 'configuracao.html',
})
export class ConfiguracaoPage {

  model: Configuracao;

  constructor(public navCtrl: NavController, public navParams: NavParams, private toast: ToastController, private configuracaoProvider: ConfiguracaoProvider) {
    this.model = new Configuracao();
    this.configuracaoProvider.get().then((result: any) => {
      this.model = result;
    });
  }

  salvar() {
    this.salvarItem().then(() => {
      this.toast.create({ message: 'Item salvo com sucesso', duration: 3000, position: 'botton' }).present();
    }).catch(() => {
      this.toast.create({ message: 'Erro ao salvar item', duration: 3000, position: 'botton' }).present();
    });
  }

  private salvarItem() {
    if (this.model.id) {
      return this.configuracaoProvider.update(this.model);
    }
  }
}
