import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { ProdutoProvider, Produto } from '../../providers/produto/produto';

@IonicPage()
@Component({
  selector: 'page-produto-editar',
  templateUrl: 'produto-editar.html',
})
export class ProdutoEditarPage {

  model: Produto;

  constructor(public navCtrl: NavController, public navParams: NavParams, private toast: ToastController, private produtoProvider: ProdutoProvider) {
    this.model = new Produto();
    if (this.navParams.data.id) {
      this.produtoProvider.get(this.navParams.data.id).then((result: any) => {
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
      return this.produtoProvider.update(this.model);
    } else {
      return this.produtoProvider.insert(this.model);
    }
  }
}
