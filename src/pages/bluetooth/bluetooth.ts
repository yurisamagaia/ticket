import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-bluetooth',
  templateUrl: 'bluetooth.html',
})
export class BluetoothPage {

  naoPareados: any = [];
  pareados: any = [];
  spinner: Boolean = false;
  impressora: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private bluetoothSerial: BluetoothSerial,
    private toast: ToastController,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
    bluetoothSerial.enable().then(() => {
      this.listarPareados();
    });
  }

  dispositivoConectado() {
    this.bluetoothSerial.isConnected().then((s) => {
      this.storage.get('impressora').then(res => {
        this.impressora = res;
      });
    }, () => {
      this.storage.remove('impressora');
      this.impressora = '';
    })
  }

  listarPareados() {
    this.bluetoothSerial.list().then(list => {
      this.pareados = list;
      this.dispositivoConectado();
    })
  }

  listarNaoPareados() {
    this.listarPareados();
    this.spinner = true;
    this.bluetoothSerial.discoverUnpaired().then(list => {
      list.forEach(value => {
        if(value.name) {
          let index = this.naoPareados.findIndex(val => val.address === value.address);
          if(index === -1) {
            this.naoPareados.push(value);
          }
        }
      });
      this.spinner = false;
    })
  }

  selecionar(address: any) {
    let loading = this.loadingCtrl.create({ content: 'Conectando impressora...' });
    loading.present();
    this.bluetoothSerial.connect(address).subscribe(() => {
      this.storage.set('impressora', address);
      this.dispositivoConectado();
      loading.dismiss();
      this.toast.create({ message: 'Impressora conectada com sucesso', duration: 3000, position: 'bottom' }).present();
      this.closeModal();
    }, () => {
      this.dispositivoConectado();
      loading.dismiss();
      this.toast.create({ message: 'Impressora desconectada', duration: 3000, position: 'bottom' }).present();
    });
  }

  desconectar() {
    let alert = this.alertCtrl.create({
      title: 'Desconectar?',
      message: 'Desconectar realmente?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },{
          text: 'Desconectar',
          handler: () => {
            this.bluetoothSerial.disconnect().then(() => {
              this.dispositivoConectado();
              this.toast.create({ message: 'Impressora desconectada com sucesso', duration: 3000, position: 'bottom' }).present();
            }, (error) => {
              let alert = this.alertCtrl.create({
                title: 'Erro',
                message: error,
                buttons: [{ text: 'Concluir' }]
              });
              alert.present();
            });
          }
        }
      ]
    });
    alert.present();
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }
}
