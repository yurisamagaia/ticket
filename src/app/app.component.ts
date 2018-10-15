import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { DatabaseProvider } from '../providers/database/database';
import { ConfiguracaoProvider, Configuracao } from '../providers/configuracao/configuracao';
import { HomePage } from '../pages/home/home';
import { ProdutoPage } from '../pages/produto/produto';
import { TransportePage } from '../pages/transporte/transporte';
import { ConfiguracaoPage } from '../pages/configuracao/configuracao';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  model: Configuracao;

  pages: Array<{title: string, component: any, icon: string, pass: boolean}>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private dbProvider: DatabaseProvider,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private configuracaoProvider: ConfiguracaoProvider
  ) {
    this.initializeApp();

    this.pages = [
      { title: 'Home', component: HomePage, icon: 'home', pass: false },
      { title: 'Produtos', component: ProdutoPage, icon: 'cart', pass: true },
      { title: 'Transportes', component: TransportePage, icon: 'car', pass: true },
      { title: 'Configurações', component: ConfiguracaoPage, icon: 'settings', pass: true }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.dbProvider.createDatabase().then(() => console.log('Tabelas criadas')).catch((e) => console.error(e));
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString('#fec443');
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    if(page.pass === true) {
      this.configuracaoProvider.getSenha().then((result: any) => {
        this.model = result;
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
              if(parseInt(data.senha) === result.senha_adm || parseInt(data.senha) === result.senha_root){
                this.nav.setRoot(page.component);
              }else{
                this.alerta('Senha não confere');
                this.openPage(page);
              }
            }
          }]
        });
        alert.present();
      });
    }else{
      this.nav.setRoot(page.component);
    }
  }

  alerta(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}
