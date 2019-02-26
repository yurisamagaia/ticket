import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { UsuarioProvider, Usuario } from '../../providers/usuario/usuario';

@IonicPage()
@Component({
  selector: 'page-usuario-editar',
  templateUrl: 'usuario-editar.html',
})
export class UsuarioEditarPage {

  model: Usuario;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private toast: ToastController,
    private usuarioProvider: UsuarioProvider,
    private alertCtrl: AlertController
  ) {
    this.model = new Usuario();
    if (this.navParams.data.id) {
      this.usuarioProvider.get(this.navParams.data.id).then((result: any) => {
        this.model = result;
      });
    }
  }

  salvar() {
    this.salvarItem().then(() => {
      this.toast.create({ message: 'Item salvo com sucesso', duration: 3000, position: 'top' }).present();
      this.navCtrl.pop();
    }).catch(() => {
      this.toast.create({ message: 'Erro ao salvar item', duration: 3000, position: 'top' }).present();
    });
  }

  private salvarItem() {
    if (this.model.id) {
      return this.usuarioProvider.update(this.model);
    } else {
      return this.usuarioProvider.insert(this.model);
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
            if(parseInt(this.model.senha) === parseInt(data.senha_antiga)) {
              if(data.senha_nova === data.senha_confirma) {
                this.model.senha = data.senha_nova;
                this.salvar();
              }else{
                this.toast.create({ message: 'Senha e Confirmar senha não conferem', duration: 3000, position: 'bottom' }).present();
                this.alterarSenha();
              }
            }else{
              this.toast.create({ message: 'Senha antiga incorreta', duration: 3000, position: 'bottom' }).present();
              this.alterarSenha();
            }
          }
        }]
    });
    alert.present();
  }
}
