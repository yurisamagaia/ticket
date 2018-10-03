import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { TransporteProvider, Transporte } from '../../providers/transporte/transporte';
import { TransporteEditarPage } from '../../pages/transporte-editar/transporte-editar';

@IonicPage()
@Component({
  selector: 'page-transporte',
  templateUrl: 'transporte.html',
})
export class TransportePage {

  transportes: any[] = [];
  somenteInativos: boolean = false;
  textoBuscar: string = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, private toast: ToastController, private trasnporteProvider: TransporteProvider) { }

  ionViewDidEnter() {
    this.buscar();
  }

  buscar() {
    this.trasnporteProvider.getAll(!this.somenteInativos, this.textoBuscar).then((result: any[]) => {
      this.transportes = result;
    });
  }

  adicionar() {
    this.navCtrl.push(TransporteEditarPage);
  }

  editar(id: number) {
    this.navCtrl.push(TransporteEditarPage, { id: id });
  }

  remover(transporte: Transporte) {
    this.trasnporteProvider.remove(transporte.id).then(() => {
      var index = this.transportes.indexOf(transporte);
      this.transportes.splice(index, 1);
      this.toast.create({ message: 'Item removido com sucesso', duration: 3000, position: 'botton' }).present();
    })
  }

  filtrar(ev: any) {
    this.buscar();
  }
}
