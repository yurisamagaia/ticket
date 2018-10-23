import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { PedidoProvider, Item } from '../../providers/pedido/pedido';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-pedido',
  templateUrl: 'pedido.html',
})
export class PedidoPage {

  item: Item;
  produtos: any[] = [];
  itens: any[] = [];
  total: any = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private pedidoProvider: PedidoProvider,
    private storage: Storage,
    private toast: ToastController
  ) {
    this.buscar(this.navParams.data.tipo);
    this.busca();
  }

  buscar(tabela) {
    this.pedidoProvider.getAll(tabela).then((result: any[]) => {
      this.produtos = result;
    });
  }

  adicionarQuantidade(item) {
    if(this.produtos[item].estoque > 0 || this.produtos[item].ilimitado === 1) {
      (this.produtos[item].quantidade ? this.produtos[item].quantidade += 1 : this.produtos[item].quantidade = 1)
      if(this.produtos[item].ilimitado === 0) {
        this.produtos[item].estoque -= 1;
      }
      this.total = this.total + this.produtos[item].valor;
    }else{
      this.toast.create({ message: 'Quantidade indisponível', duration: 3000, position: 'middle' }).present();
    }
  }

  removerQuantidade(item) {
    if(this.produtos[item].quantidade > 0) {
      this.produtos[item].quantidade -= 1;
      if(this.produtos[item].ilimitado === 0) {
        this.produtos[item].estoque += 1;
      }
      this.total = this.total - this.produtos[item].valor;
    }
  }

  salvar() {
    this.salvarPedido().then(data => {
      this.salvarItem(data.insertId).then(data => {
        this.toast.create({ message: 'Item salvo com sucesso', duration: 3000, position: 'middle' }).present();
        this.navCtrl.pop();
      }).catch(() => {
        this.toast.create({ message: 'Erro ao salvar item', duration: 3000, position: 'middle' }).present();
      });
    }).catch(() => {
      this.toast.create({ message: 'Erro ao salvar item', duration: 3000, position: 'middle' }).present();
    });
  }

  private salvarItem(id_pedido) {
    return this.pedidoProvider.insertPedidoItem(this.produtos, id_pedido);
  }

  private salvarPedido() {
    return this.pedidoProvider.insertPedido(this.total);
  }

  limpar() {
    this.buscar(this.navParams.data.tipo);
    this.total = 0;
  }

  busca() {
    this.pedidoProvider.getPedido().then((result: any[]) => {
      console.log(JSON.stringify(result));
    });
    this.pedidoProvider.getItens().then((result: any[]) => {
      console.log(JSON.stringify(result));
    });
  }
}
