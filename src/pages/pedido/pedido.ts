import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { PedidoProvider } from '../../providers/pedido/pedido';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-pedido',
  templateUrl: 'pedido.html',
})
export class PedidoPage {

  produtos: any[] = [];
  total: any = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private pedidoProvider: PedidoProvider,
    private storage: Storage,
    private toast: ToastController
  ) {
    this.buscar(this.navParams.data.tipo);
  }

  buscar(tabela) {
    this.pedidoProvider.getAll(tabela).then((result: any[]) => {
      this.produtos = result;
    });
  }

  adicionarQuantidade(item) {
    if(item.quantidade > 0 || item.ilimitado === 1) {
      (item.qtd ? item.qtd += 1 : item.qtd = 1)
      item.quantidade -= 1;
      this.total = this.total + item.valor;
    }else{
      this.toast.create({ message: 'Quantidade indisponível', duration: 3000, position: 'top' }).present();
    }
  }

  removerQuantidade(item) {
    if(item.qtd > 0) {
      item.qtd -= 1;
      item.quantidade += 1;
      this.total = this.total - item.valor;
    }
  }

  salvar() {
    this.salvarItem().then(data => {
      console.log(data);
      this.toast.create({ message: 'Item salvo com sucesso', duration: 3000, position: 'top' }).present();
      this.navCtrl.pop();
    }).catch(() => {
      this.toast.create({ message: 'Erro ao salvar item', duration: 3000, position: 'top' }).present();
    });
  }

  private salvarItem() {
    return this.pedidoProvider.insertPedido(this.total);
  }

  limpar() {
    this.buscar(this.navParams.data.tipo);
    this.total = 0;
  }
}
