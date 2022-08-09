import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EnergyCalculationComponent } from './category/energy-calculation.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent, EnergyCalculationComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
