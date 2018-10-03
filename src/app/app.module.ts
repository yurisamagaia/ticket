import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, LOCALE_ID } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ProdutoPage } from '../pages/produto/produto';
import { ProdutoEditarPage } from '../pages/produto-editar/produto-editar';
import { TransportePage } from '../pages/transporte/transporte';
import { TransporteEditarPage } from '../pages/transporte-editar/transporte-editar';
import { ConfiguracaoPage } from '../pages/configuracao/configuracao';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import { DatabaseProvider } from '../providers/database/database';
import { ProdutoProvider } from '../providers/produto/produto';
import { ConfiguracaoProvider } from '../providers/configuracao/configuracao';
import { TransporteProvider } from '../providers/transporte/transporte';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ProdutoPage,
    ProdutoEditarPage,
    TransportePage,
    TransporteEditarPage,
    ConfiguracaoPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ProdutoPage,
    ProdutoEditarPage,
    TransportePage,
    TransporteEditarPage,
    ConfiguracaoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: LOCALE_ID, useValue: 'pt-BR'},
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SQLite,
    DatabaseProvider,
    ProdutoProvider,
    ConfiguracaoProvider,
    TransporteProvider
  ]
})
export class AppModule {}
