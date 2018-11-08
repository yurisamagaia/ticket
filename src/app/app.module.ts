import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, LOCALE_ID } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ProdutoPage } from '../pages/produto/produto';
import { ProdutoEditarPage } from '../pages/produto-editar/produto-editar';
import { TransportePage } from '../pages/transporte/transporte';
import { TransporteEditarPage } from '../pages/transporte-editar/transporte-editar';
import { ConfiguracaoPage } from '../pages/configuracao/configuracao';
import { PedidoPage } from '../pages/pedido/pedido';
import { BluetoothPage } from '../pages/bluetooth/bluetooth';
import { FinalizarPage } from '../pages/finalizar/finalizar';
import { ModalPlacaPage } from '../pages/modal-placa/modal-placa';
import { EstornarPage } from '../pages/estornar/estornar';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SQLite } from '@ionic-native/sqlite';
import { IonicStorageModule } from '@ionic/storage';
import { DatePipe } from '@angular/common';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

import { DatabaseProvider } from '../providers/database/database';
import { ProdutoProvider } from '../providers/produto/produto';
import { ConfiguracaoProvider } from '../providers/configuracao/configuracao';
import { TransporteProvider } from '../providers/transporte/transporte';
import { PedidoProvider } from '../providers/pedido/pedido';
import { CommandProvider } from '../providers/command/command';

import { MaskInput } from 'mask-ioni-3/mask-input';
import { EstornarProvider } from '../providers/estornar/estornar';

registerLocaleData(ptBr);

@NgModule({
  declarations: [
    MyApp,
    MaskInput,
    HomePage,
    ProdutoPage,
    ProdutoEditarPage,
    TransportePage,
    TransporteEditarPage,
    ConfiguracaoPage,
    PedidoPage,
    BluetoothPage,
    FinalizarPage,
    ModalPlacaPage,
    EstornarPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ProdutoPage,
    ProdutoEditarPage,
    TransportePage,
    TransporteEditarPage,
    ConfiguracaoPage,
    PedidoPage,
    BluetoothPage,
    FinalizarPage,
    ModalPlacaPage,
    EstornarPage
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
    TransporteProvider,
    PedidoProvider,
    DatePipe,
    BluetoothSerial,
    EstornarProvider
  ]
})
export class AppModule {}
