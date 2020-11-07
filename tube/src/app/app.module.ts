import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';

import { AppComponent } from './app.component';
import { registerLocaleData } from '@angular/common';
import { NgxPayPalModule } from 'ngx-paypal';

import localeIt from '@angular/common/locales/it';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MaterialModule } from './material.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { DragDropDirective } from './dragdrop.directive';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

registerLocaleData(localeIt, 'it');

@NgModule({
  declarations: [
    AppComponent,
    DragDropDirective,
  ],
  imports: [
    MaterialModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgxPayPalModule,
    ReactiveFormsModule
  ],
  entryComponents: [],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'it-IT' }, { provide: LOCALE_ID, useValue: 'it' }, {provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
