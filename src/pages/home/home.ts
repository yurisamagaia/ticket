import { Component } from '@angular/core';
import { NavController, ModalController, ActionSheetController, AlertController, ToastController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

import { ConfiguracaoProvider, Configuracao } from '../../providers/configuracao/configuracao';
import { PedidoPage } from '../../pages/pedido/pedido';
import { EstornarPage } from '../../pages/estornar/estornar';
import { BluetoothPage } from '../../pages/bluetooth/bluetooth';

import { PedidoProvider } from '../../providers/pedido/pedido';
import { EstornarProvider } from '../../providers/estornar/estornar';
import { RelatorioProvider } from '../../providers/relatorio/relatorio';
import { ImprimirProvider } from '../../providers/imprimir/imprimir';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  model: Configuracao;

  constructor(
    public navCtrl: NavController,
    private configuracaoProvider: ConfiguracaoProvider,
    public modalCtrl: ModalController,
    private pedidoProvider: PedidoProvider,
    private estornarProvider: EstornarProvider,
    private relatorioProvider: RelatorioProvider,
    private imprimirProvider: ImprimirProvider,
    public actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private toast: ToastController,
    private bluetoothSerial: BluetoothSerial
  ) {
    this.config();
    //this.buscaTeste();
    this.estorn();
  }

  relatorio() {
    let alert = this.alertCtrl.create({
      title: 'Relatório',
      subTitle: 'Imprimir relatório',
      buttons: [{
        text: 'Cancelar',
        role: 'cancel'
      },{
        text: 'Imprimir',
        handler: data => {
          this.relatorioProvider.relatorio().then((result: any[]) => {
            this.relatorioProvider.relatorioTotal().then((total) => {
              this.relatorioProvider.relatorioTotalDinheiro().then((totalDinheiro) => {
                this.relatorioProvider.relatorioTotalCartao().then((totalCartao) => {
                  this.imprimirProvider.relatorio(result, this.model, total, totalDinheiro, totalCartao).then((imprime) => {
                    this.bluetoothSerial.write(imprime).then(() => {
                      this.toast.create({ message: 'Pedido realizado com sucesso, aguarde a impressão do ticket', duration: 4000, position: 'bottom' }).present();
                    }, (error) => {
                      let alert = this.alertCtrl.create({
                        title: 'Erro',
                        message: error,
                        buttons: [{ text: 'Concluir' }]
                      });
                      alert.present();
                    });
                  });
                });
              });
            });
          })
        }
      }]
    });
    alert.present();
  }

  sangria() {
    this.relatorioProvider.relatorioTotal().then((result: any) => {
      this.relatorioProvider.getSangria().then((sangria: any) => {
        var total = result.total - sangria.sangria;
        let alert = this.alertCtrl.create({
          title: 'Valor disponível',
          subTitle: 'R$ '+total.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
          inputs: [{
            name: 'valor',
            placeholder: 'Valor Sangria',
            type: 'number'
          }],
          buttons: [{
            text: 'Cancelar',
            role: 'cancel'
          },{
            text: 'Confirmar',
            handler: data => {
              if(data.valor > 0) {
                if(data.valor <= total) {
                  var total_sangria = parseFloat(data.valor) + parseFloat(sangria.sangria);
                  this.relatorioProvider.updateSangria(total_sangria, this.model.id);
                  this.toast.create({ message: 'Sangria realizada com sucesso', duration: 3000, position: 'top' }).present();
                } else {
                  this.toast.create({ message: 'O valor deve ser menor que o valor disponível', duration: 3000, position: 'top' }).present();
                  this.sangria();
                }
              } else {
                this.toast.create({ message: 'O valor não pode ser vazio', duration: 3000, position: 'top' }).present();
                this.sangria();
              }
            }
          }]
        });
        alert.present();
      })
    })
  }

  estorn() {
    this.estornarProvider.getAll().then((result: any[]) => {
      console.log(JSON.stringify(result));
    })
  }

  buscaTeste() {
    this.pedidoProvider.getPedido().then((result: any[]) => {
      console.log(JSON.stringify(result));
    });
    this.pedidoProvider.getItens().then((result: any[]) => {
      console.log(JSON.stringify(result));
    });
  }

  config() {
    this.model = new Configuracao();
    this.configuracaoProvider.get().then((result: any) => {
      this.model = result;
      console.log(JSON.stringify(result))
    });
  }

  pedido(tipo: String) {
    this.navCtrl.push(PedidoPage, { tipo: tipo });
  }

  bluetooth() {
    let profileModal = this.modalCtrl.create(BluetoothPage);
    profileModal.present();
  }

  estornar() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Estornar'
    });
    if(this.model.venda === 1) {
      actionSheet.addButton({
        text: 'Venda',
        handler: () => {
          this.navCtrl.push(EstornarPage, { tipo: 'produto' });
        }
      });
    }
    if(this.model.estacionamento === 1) {
      actionSheet.addButton({
        text: 'Estacionamento',
        handler: () => {
          this.navCtrl.push(EstornarPage, { tipo: 'transporte' });
        }
      });
    }
    actionSheet.addButton({text: 'Cancelar', 'role': 'cancel' });
    actionSheet.present();
  }
}
