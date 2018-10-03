import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { DatabaseProvider } from '../providers/database/database'
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

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private dbProvider: DatabaseProvider) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Produto', component: ProdutoPage },
      { title: 'Transporte', component: TransportePage },
      { title: 'Configurações', component: ConfiguracaoPage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.dbProvider.createDatabase().then(() => console.log('Tabelas criadas')).catch((e) => console.error(e));
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }
}
