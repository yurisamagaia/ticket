import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { ConfiguracaoProvider, Configuracao } from '../../providers/configuracao/configuracao';

@IonicPage()
@Component({
  selector: 'page-configuracao',
  templateUrl: 'configuracao.html',
})
export class ConfiguracaoPage {

  model: Configuracao;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private toast: ToastController,
    private alertCtrl: AlertController,
    private configuracaoProvider: ConfiguracaoProvider
  ) {
    this.model = new Configuracao();
    this.configuracaoProvider.get().then((result: any) => {
      this.model = result;
    });
  }

  salvar() {
    this.salvarItem().then(() => {
      this.toast.create({ message: 'Configurações salvas com sucesso', duration: 3000, position: 'bottom' }).present();
    }).catch(() => {
      this.toast.create({ message: 'Erro ao salvar configurações', duration: 3000, position: 'bottom' }).present();
    });
  }

  private salvarItem() {
    if (this.model.id) {
      return this.configuracaoProvider.update(this.model);
    }
  }

  alterarSenha() {
    let alert = this.alertCtrl.create({
      title: 'Recuperar Senha',
      inputs: [{
          name: 'senha_antiga',
          placeholder: 'Senha Antiga',
          type: 'password'
        },{
          name: 'senha_nova',
          placeholder: 'Senha Nova',
          type: 'password'
        },{
          name: 'senha_confirma',
          placeholder: 'Confirmar Senha Nova',
          type: 'password'
        }],
      buttons: [{
          text: 'Cancelar',
          role: 'cancel'
        },{
          text: 'Alterar',
          handler: data => {
            this.getSenha().then((result: any) => {
              if(parseInt(result.senha_adm) === parseInt(data.senha_antiga)) {
                if(data.senha_nova === data.senha_confirma) {
                  this.model.senha_adm = data.senha_nova;
                  this.salvarSenha().then(() => {
                    this.toast.create({ message: 'Senha alterada com sucesso', duration: 3000, position: 'bottom' }).present();
                  }).catch(e => {
                    this.toast.create({ message: e, duration: 3000, position: 'bottom' }).present();
                  });
                }else{
                  this.toast.create({ message: 'Senha e Confirmar senha não conferem', duration: 3000, position: 'bottom' }).present();
                  this.alterarSenha();
                }
              }else{
                this.toast.create({ message: 'Senha antiga incorreta', duration: 3000, position: 'bottom' }).present();
                this.alterarSenha();
              }
            });
          }
        }]
    });
    alert.present();
  }

  private getSenha() {
    return this.configuracaoProvider.getSenha();
  }

  private salvarSenha() {
    return this.configuracaoProvider.updateSenha(this.model);
  }
}
