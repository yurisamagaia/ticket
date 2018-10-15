import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProdutoProvider } from '../../providers/produto/produto';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the PedidoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pedido',
  templateUrl: 'pedido.html',
})
export class PedidoPage {

  produtos: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private produtoProvider: ProdutoProvider, private storage: Storage) {
    console.log(this.navParams.data.tipo);
    this.buscar();
  }

  buscar() {
    this.produtoProvider.getLista().then((result: any[]) => {
      this.produtos = result;
      console.log(JSON.stringify(result));
    });
  }

  adicionarQuantidade(item) {

    item.qtd = 1;

    console.log(JSON.stringify(item));
    this.save(item);
  }

  save(item) {
    console.log(item);
    this.storage.set('pedido', {id: item.id, qtd: item.qtd});
    this.storage.get('pedido').then(data => {
      console.log(JSON.stringify(data));
    })
  }

  ionViewDidLoad() {

  }
}
