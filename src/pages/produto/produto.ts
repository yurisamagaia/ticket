import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ItemSliding } from 'ionic-angular';
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
  tipo: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, private toast: ToastController, private produtoProvider: ProdutoProvider) { }

  ionViewDidEnter() {
    this.buscar();
  }

  mudaTipo(tipo) {
    this.buscar();
  }

  buscar() {
    this.produtoProvider.getAll(!this.somenteInativos, this.textoBuscar, this.tipo).then((result: any[]) => {
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
    });
  }

  ativar(item: ItemSliding, produto: Produto) {
    this.salvarItem(produto).then(() => {
      this.toast.create({ message: 'Item salvo com sucesso', duration: 3000, position: 'botton' }).present();
    }).catch(() => {
      this.toast.create({ message: 'Erro ao salvar item', duration: 3000, position: 'botton' }).present();
    });
  }

  private salvarItem(produto) {
    (produto.ativo ? produto.ativo = 0 : produto.ativo = 1)
    return this.produtoProvider.update(produto);
  }

  filtrar(ev: any) {
    this.buscar();
  }
}
