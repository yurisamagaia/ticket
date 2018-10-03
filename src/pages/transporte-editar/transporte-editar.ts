import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { TransporteProvider, Transporte } from '../../providers/transporte/transporte';

@IonicPage()
@Component({
  selector: 'page-transporte-editar',
  templateUrl: 'transporte-editar.html',
})
export class TransporteEditarPage {

  model: Transporte;

  constructor(public navCtrl: NavController, public navParams: NavParams, private toast: ToastController, private transporteProvider: TransporteProvider) {
    this.model = new Transporte();
    if (this.navParams.data.id) {
      this.transporteProvider.get(this.navParams.data.id).then((result: any) => {
        this.model = result;
      })
    }
  }

  salvar() {
    this.salvarItem().then(() => {
      this.toast.create({ message: 'Item salvo com sucesso', duration: 3000, position: 'botton' }).present();
      this.navCtrl.pop();
    }).catch(() => {
      this.toast.create({ message: 'Erro ao salvar item', duration: 3000, position: 'botton' }).present();
    });
  }

  private salvarItem() {
    if (this.model.id) {
      return this.transporteProvider.update(this.model);
    } else {
      return this.transporteProvider.insert(this.model);
    }
  }
}
