import { Component } from '@angular/core';
import { NavController, ModalController, ActionSheetController, AlertController, ToastController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

import { PedidoPage } from '../../pages/pedido/pedido';
import { EstornarPage } from '../../pages/estornar/estornar';
import { BluetoothPage } from '../../pages/bluetooth/bluetooth';

import { ConfiguracaoProvider, Configuracao } from '../../providers/configuracao/configuracao';
import { PedidoProvider } from '../../providers/pedido/pedido';
import { RelatorioProvider } from '../../providers/relatorio/relatorio';
import { ImprimirProvider } from '../../providers/imprimir/imprimir';
import { DatabaseProvider } from '../../providers/database/database';

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
    private relatorioProvider: RelatorioProvider,
    private databaseProvider: DatabaseProvider,
    private imprimirProvider: ImprimirProvider,
    public actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private toast: ToastController,
    private bluetoothSerial: BluetoothSerial
  ) {
    this.config();
  }

  fecharCaixa() {
    this.configuracaoProvider.getSenha().then((senhaAcesso: any) => {
      let alert = this.alertCtrl.create({
        title: 'Fechar caixa',
        inputs: [{
          name: 'senha',
          placeholder: 'Senha de acesso',
          type: 'password'
        }],
        buttons: [{
          text: 'Cancelar',
          role: 'cancel'
        },{
          text: 'Confirmar',
          handler: data => {
            if(parseInt(data.senha) === senhaAcesso.senha_adm || parseInt(data.senha) === senhaAcesso.senha_root){
              this.configuracaoProvider.get().then((configuracoes: any) => {
                this.pedidoProvider.getAbertura().then((aberturaCaixa: any) => {
                  this.relatorioProvider.relatorio().then((result: any[]) => {
                    this.relatorioProvider.relatorioTotal().then((total) => {
                      this.relatorioProvider.relatorioTotalDinheiro().then((totalDinheiro) => {
                        this.relatorioProvider.relatorioTotalCartao().then((totalCartao) => {
                          this.imprimirProvider.relatorio(result, configuracoes, total, totalDinheiro, totalCartao, aberturaCaixa, 'FECHAMENTO DE CAIXA').then((imprime) => {
                            this.bluetoothSerial.write(imprime).then(() => {
                              this.databaseProvider.clearDatabase().then(returnClear => {
                                if(returnClear === true) {
                                  this.toast.create({ message: 'Caixa fechado com sucesso, aguarde a impressão do ticket', duration: 4000, position: 'bottom' }).present();
                                } else {
                                  this.toast.create({ message: 'Erro ao fechar caixa', duration: 4000, position: 'bottom' }).present();
                                }
                              });
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
                  });
                });
              });
            }else{
              this.toast.create({ message: 'Senha não confere', duration: 4000, position: 'bottom' }).present();
              this.fecharCaixa();
            }
          }
        }]
      });
      alert.present();
    });
  }

  relatorio() {
    this.configuracaoProvider.getSenha().then((senhaAcesso: any) => {
      let alert = this.alertCtrl.create({
        title: 'Senha de acesso',
        inputs: [{
          name: 'senha',
          placeholder: 'Senha de acesso',
          type: 'password'
        }],
        buttons: [{
          text: 'Cancelar',
          role: 'cancel'
        },{
          text: 'Confirmar',
          handler: data => {
            if(parseInt(data.senha) === senhaAcesso.senha_adm || parseInt(data.senha) === senhaAcesso.senha_root){
              this.configuracaoProvider.get().then((configuracoes: any) => {
                this.relatorioProvider.relatorio().then((result: any[]) => {
                  this.relatorioProvider.relatorioTotal().then((total) => {
                    this.relatorioProvider.relatorioTotalDinheiro().then((totalDinheiro) => {
                      this.relatorioProvider.relatorioTotalCartao().then((totalCartao) => {
                        this.imprimirProvider.relatorio(result, configuracoes, total, totalDinheiro, totalCartao, null, 'RELATORIO DE MOVIMENTACAO').then((imprime) => {
                          this.bluetoothSerial.write(imprime).then(() => {
                            this.toast.create({ message: 'Relatório realizado com sucesso, aguarde a impressão do ticket', duration: 4000, position: 'bottom' }).present();
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
                });
              });
            }else{
              this.toast.create({ message: 'Senha não confere', duration: 4000, position: 'bottom' }).present();
              this.relatorio();
            }
          }
        }]
      });
      alert.present();
    });
  }

  sangria() {
    this.configuracaoProvider.getSenha().then((senhaAcesso: any) => {
      let alert = this.alertCtrl.create({
        title: 'Senha de acesso',
        inputs: [{
          name: 'senha',
          placeholder: 'Senha de acesso',
          type: 'password'
        }],
        buttons: [{
          text: 'Cancelar',
          role: 'cancel'
        },{
          text: 'Confirmar',
          handler: data => {
            if(parseInt(data.senha) === senhaAcesso.senha_adm || parseInt(data.senha) === senhaAcesso.senha_root){
              this.configuracaoProvider.get().then((configuracoes: any) => {
                this.relatorioProvider.relatorioTotal().then((resultTotal: any) => {
                  var total = (configuracoes.troco + resultTotal) - configuracoes.sangria;
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
                            var total_sangria = parseFloat(data.valor) + parseFloat(configuracoes.sangria);
                            this.configuracaoProvider.updateSangria(total_sangria, configuracoes.id).then(() => {
                              this.imprimirProvider.imprimeSangriaTroco(configuracoes, 'Sangria', data.valor).then((imprime) => {
                                this.bluetoothSerial.write(imprime).then(() => {
                                  this.config();
                                  this.toast.create({ message: 'Sangria realizada com sucesso', duration: 3000, position: 'top' }).present();
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
            }else{
              this.toast.create({ message: 'Senha não confere', duration: 4000, position: 'bottom' }).present();
              this.sangria();
            }
          }
        }]
      });
      alert.present();
    });
  }

  troco() {
    this.configuracaoProvider.getSenha().then((senhaAcesso: any) => {
      let alert = this.alertCtrl.create({
        title: 'Senha de acesso',
        inputs: [{
          name: 'senha',
          placeholder: 'Senha de acesso',
          type: 'password'
        }],
        buttons: [{
          text: 'Cancelar',
          role: 'cancel'
        },{
          text: 'Confirmar',
          handler: data => {
            if(parseInt(data.senha) === senhaAcesso.senha_adm || parseInt(data.senha) === senhaAcesso.senha_root){
              this.configuracaoProvider.get().then((configuracoes: any) => {
                let alert = this.alertCtrl.create({
                  title: 'Valor Troco',
                  inputs: [{
                    name: 'valor',
                    placeholder: 'Valor Troco',
                    type: 'number'
                  }],
                  buttons: [{
                    text: 'Cancelar',
                    role: 'cancel'
                  },{
                    text: 'Confirmar',
                    handler: data => {
                      if(data.valor > 0) {
                        var total_troco = parseFloat(data.valor) + parseFloat(configuracoes.troco);
                        this.configuracaoProvider.updateTroco(total_troco, this.model.id).then(() => {
                          this.imprimirProvider.imprimeSangriaTroco(configuracoes, 'Troco', data.valor).then((imprime) => {
                            this.bluetoothSerial.write(imprime).then(() => {
                              this.config();
                              this.toast.create({ message: 'Troco realizado com sucesso', duration: 3000, position: 'top' }).present();
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
                      } else {
                        this.toast.create({ message: 'O valor não pode ser vazio', duration: 3000, position: 'top' }).present();
                        this.troco();
                      }
                    }
                  }]
                });
                alert.present();
              })
            }else{
              this.toast.create({ message: 'Senha não confere', duration: 4000, position: 'bottom' }).present();
              this.sangria();
            }
          }
        }]
      });
      alert.present();
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
