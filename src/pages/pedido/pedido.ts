import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController, AlertController } from 'ionic-angular';
import { ProdutoProvider } from '../../providers/produto/produto';
import { Storage } from '@ionic/storage';
import { FinalizarPage } from '../../pages/finalizar/finalizar';
import { ModalPlacaPage } from '../../pages/modal-placa/modal-placa';
import { HomePage } from '../../pages/home/home';

@IonicPage()
@Component({
  selector: 'page-pedido',
  templateUrl: 'pedido.html',
})
export class PedidoPage {

  produtos: any[] = [];
  itens: any[] = [];
  total: number = 0;
  tipo: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private produtoProvider: ProdutoProvider,
    private storage: Storage,
    private toast: ToastController,
    public modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {
    this.tipo = this.navParams.get('tipo');
    this.buscar(this.tipo);
  }

  buscar(tabela) {
    this.produtoProvider.getAll(true, null, tabela).then((result: any[]) => {
      this.produtos = result;
    });
  }

  estacionamento(produto) {
    let profileModal = this.modalCtrl.create(ModalPlacaPage);
    profileModal.onDidDismiss(data => {
      if(data) {
        var ar_pedido = [];
        var total = 0;
        produto.modelo = data.modelo;
        produto.placa = data.placa;
        produto.quantidade = 1;
        ar_pedido.push(produto);
        total = produto.valor * produto.quantidade;
        let finalizarModal = this.modalCtrl.create(FinalizarPage, {itens: ar_pedido, total: total, tipo: 'finalizar'});
        finalizarModal.onDidDismiss(data => {
          if(data === 'finalizar') {
            this.navCtrl.setRoot(HomePage);
          }
        });
        finalizarModal.present();
      }
    });
    profileModal.present();
  }

  finalizar() {
    var itens = [];
    var total = 0;
    this.produtos.forEach(value => {
      if(value.quantidade > 0) {
        itens.push(value);
        total += (parseFloat(value.valor)*value.quantidade);
      }
    });
    let profileModal = this.modalCtrl.create(FinalizarPage, {itens: itens, total: total, tipo: 'finalizar'});
    profileModal.onDidDismiss(data => {
      if(data === 'finalizar') {
        this.navCtrl.setRoot(HomePage);
      }
    });
    profileModal.present();
  }

  adicionarQuantidade(item) {
    if(this.produtos[item].estoque > 0 || this.produtos[item].ilimitado === 1) {
      (this.produtos[item].quantidade ? this.produtos[item].quantidade += 1 : this.produtos[item].quantidade = 1)
      if(this.produtos[item].ilimitado === 0) {
        this.produtos[item].estoque -= 1;
      }
      this.total = this.total + this.produtos[item].valor;
    }else{
      this.toast.create({ message: 'Quantidade indisponível', duration: 3000, position: 'top' }).present();
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

  limpar() {
    this.buscar(this.navParams.data.tipo);
    this.total = 0;
  }
}
