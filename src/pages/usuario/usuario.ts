import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ItemSliding } from 'ionic-angular';
import { UsuarioProvider, Usuario } from '../../providers/usuario/usuario';
import { UsuarioEditarPage } from '../../pages/usuario-editar/usuario-editar';

@IonicPage()
@Component({
  selector: 'page-usuario',
  templateUrl: 'usuario.html',
})
export class UsuarioPage {

  usuarios: any[] = [];
  textoBuscar: string = null;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private toast: ToastController,
    private usuarioProvider: UsuarioProvider
  ) { }

  ionViewDidEnter() {
    this.buscar();
  }

  buscar() {
    this.usuarioProvider.getAll(null, this.textoBuscar).then((result: any[]) => {
      this.usuarios = result;
    });
  }

  adicionar() {
    this.navCtrl.push(UsuarioEditarPage);
  }

  editar(id: number) {
    this.navCtrl.push(UsuarioEditarPage, { id: id });
  }

  remover(usuario: Usuario) {
    this.usuarioProvider.remove(usuario.id).then(() => {
      var index = this.usuarios.indexOf(usuario);
      this.usuarios.splice(index, 1);
      this.toast.create({ message: 'Item removido com sucesso', duration: 3000, position: 'top' }).present();
    });
  }

  ativar(item: ItemSliding, usuario: Usuario) {
    this.salvarItem(usuario).then(() => {
      this.toast.create({ message: 'Item salvo com sucesso', duration: 3000, position: 'top' }).present();
    }).catch(() => {
      this.toast.create({ message: 'Erro ao salvar item', duration: 3000, position: 'top' }).present();
    });
  }

  private salvarItem(usuario) {
    (usuario.ativo ? usuario.ativo = 0 : usuario.ativo = 1)
    return this.usuarioProvider.update(usuario);
  }

  filtrar(ev: any) {
    this.buscar();
  }
}
