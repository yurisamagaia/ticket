import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { ProdutoProvider, Produto } from '../../providers/produto/produto';
import { ProdutoEditarPage } from '../../pages/produto-editar/produto-editar';

@IonicPage()
@Component({
  selector: 'page-produto',
  templateUrl: 'produto.html',
})
export class ProdutoPage {

  produtos: any[] = [];
  somenteInativos: boolean = false;
  textoBuscar: string = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, private toast: ToastController, private produtoProvider: ProdutoProvider) { }

  ionViewDidEnter() {
    this.buscar();
  }

  buscar() {
    this.produtoProvider.getAll(!this.somenteInativos, this.textoBuscar).then((result: any[]) => {
      this.produtos = result;
    });
  }

  adicionar() {
    this.navCtrl.push(ProdutoEditarPage);
  }

  editar(id: number) {
    this.navCtrl.push(ProdutoEditarPage, { id: id });
  }

  remover(produto: Produto) {
    this.produtoProvider.remove(produto.id).then(() => {
      var index = this.produtos.indexOf(produto);
      this.produtos.splice(index, 1);
      this.toast.create({ message: 'Item removido com sucesso', duration: 3000, position: 'botton' }).present();
    })
  }

  filtrar(ev: any) {
    this.buscar();
  }
}
